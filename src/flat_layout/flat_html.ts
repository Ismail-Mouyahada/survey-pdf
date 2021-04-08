import { IQuestion, QuestionHtmlModel, Serializer } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatHTML extends FlatQuestion {
    protected question: QuestionHtmlModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
    }
    private chooseRender(html: string): 'standard' | 'image' {
        if (/<[^>]*style[^<]*>/.test(html) ||
            /<[^>]*table[^<]*>/.test(html) ||
            /&\w+;/.test(html)) {
            return 'image';
        }
        return 'standard';
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        let renderAs: 'auto' | 'standard' | 'image' = <'auto' | 'standard' | 'image'>this.question.renderAs;
        if (renderAs === 'auto') renderAs = this.controller.htmlRenderAs;
        if (renderAs === 'auto') renderAs = this.chooseRender(SurveyHelper.getLocString(this.question.locHtml));
        if (renderAs === 'image') {
            const width: number = SurveyHelper.getPageAvailableWidth(this.controller);
            const html: string = SurveyHelper.createDivBlock(
                SurveyHelper.getLocString(this.question.locHtml), this.controller);
            const { url, aspect }: { url: string, aspect: number } =
                await SurveyHelper.htmlToImage(html, width, this.controller);
            const height: number = width / aspect;
            return [SurveyHelper.createImageFlat(point, this.question, this.controller, url, width, height)];
        }
        const html: string = SurveyHelper.createDivBlock(SurveyHelper.getLocString(this.question.locHtml), this.controller);
        return [SurveyHelper.splitHtmlRect(this.controller, await SurveyHelper.createHTMLFlat(
            point, this.question, this.controller, html))];
    }
}

Serializer.removeProperty('html', 'renderAs');
Serializer.addProperty('html', {
    name: 'renderAs',
    default: 'auto',
    choices: ['auto', 'standard', 'image']
});
FlatRepository.getInstance().register('html', FlatHTML);