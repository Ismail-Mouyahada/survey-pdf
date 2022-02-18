import { IQuestion, QuestionImageModel } from 'survey-core';
import { SurveyPDF } from '../survey';
import { IPoint, DocController } from '../doc_controller';
import { FlatQuestion } from './flat_question';
import { FlatRepository } from './flat_repository';
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class FlatImage extends FlatQuestion {
    protected question: QuestionImageModel;
    public constructor(protected survey: SurveyPDF,
        question: IQuestion, controller: DocController) {
        super(survey, question, controller);
        this.question = <QuestionImageModel>question;
    }
    public async generateFlatsContent(point: IPoint): Promise<IPdfBrick[]> {
        const widthPt: number = SurveyHelper.pxToPt(<any>this.question.imageWidth);
        const heightPt: number = SurveyHelper.pxToPt(<any>this.question.imageHeight);
        return [await SurveyHelper.createImageFlat(point, this.question,
            this.controller, this.question.imageLink, widthPt, heightPt)];
    }
}

FlatRepository.getInstance().register('image', FlatImage);