import { IQuestion, QuestionHtmlModel, JsonObject } from 'survey-core';
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
    private chooseRender(html: string): 'auto' | 'standard' | 'image' {
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
            let width: number = SurveyHelper.getPageAvailableWidth(this.controller);
            let { url, aspect } = await SurveyHelper.htmlToImage(
                SurveyHelper.getLocString(this.question.locHtml), width, this.controller);
            let height: number = width / aspect;
            return [SurveyHelper.createImageFlat(point, this.question,
                this.controller, url, width, height)];
        }
        let html: string = SurveyHelper.createDivBlock(SurveyHelper.getLocString(this.question.locHtml), this.controller);
        return [SurveyHelper.splitHtmlRect(this.controller, await SurveyHelper.createHTMLFlat(
            point, this.question, this.controller, html))];
    }
}

JsonObject.metaData.addProperty('html', {
    name: 'renderAs',
    default: 'auto',
    choices: ['auto', 'standard', 'image']
});
FlatRepository.getInstance().register('html', FlatHTML);