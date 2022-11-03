(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatMatrix } from '../src/flat_layout/flat_matrix';
import { TestHelper } from '../src/helper_test';
const __dummy_mt = new FlatMatrix(null, null, null);

test('Matrix default value', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'matrix_defaultvalue',
                title: 'Please indicate if you agree or disagree with the following statements',
                defaultValue: 'Column',
                columns: [
                    'Column',
                    'Column2'
                ]
            }]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController({ useValuesInAcroforms: true });
    await survey['renderSurvey'](controller);
    let acroFormFields = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].value).toBe('Column');
    expect(acroFormFields[1].AS).toBe('/Column');
    expect(acroFormFields[2].AS).toBe('/Off');

    controller = new DocController({ useValuesInAcroforms: false });
    await survey['renderSurvey'](controller);
    acroFormFields = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].value).toBe('index0');
    expect(acroFormFields[1].AS).toBe('/index0');
    expect(acroFormFields[2].AS).toBe('/Off');
});
test('Check matrix rows names and values with one row without value', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'matrix_defaultvalue',
                title: 'Please indicate if you agree or disagree with the following statements',
                defaultValue: 'Column',
                columns: [
                    'Column',
                    'Column2'
                ]
            }]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.getAllQuestions()[0].id = 'questionId';
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    const acroFormFields = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].fieldName).toBe('questionId_row_index0');
    expect(acroFormFields[1].AS).toBe('/index0');
    expect(acroFormFields[2].AS).toBe('/Off');
});
test('Check matrix rows names and values with multiple rows', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                showHeader: false,
                type: 'matrix',
                name: 'matrix_defaultvalue',
                title: 'Please indicate if you agree or disagree with the following statements',
                defaultValue: { Row: 'Column', Row2: 'Column2' },
                rows: [
                    'Row',
                    'Row2'
                ],
                columns: [
                    'Column',
                    'Column2'
                ]
            }]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    survey.getAllQuestions()[0].id = 'questionId';
    let controller: DocController = new DocController({ useValuesInAcroforms: true });
    await survey['renderSurvey'](controller);
    let acroFormFields = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].fieldName).toBe('questionId_row_Row');
    expect(acroFormFields[1].AS).toBe('/Column');
    expect(acroFormFields[2].AS).toBe('/Off');
    expect(acroFormFields[3].fieldName).toBe('questionId_row_Row2');
    expect(acroFormFields[4].AS).toBe('/Off');
    expect(acroFormFields[5].AS).toBe('/Column2');

    controller = new DocController({ useValuesInAcroforms: false });
    await survey['renderSurvey'](controller);
    acroFormFields = controller.doc.internal.acroformPlugin.acroFormDictionaryRoot.Fields;
    expect(acroFormFields[0].fieldName).toBe('questionId_row_index0');
    expect(acroFormFields[1].AS).toBe('/index0');
    expect(acroFormFields[2].AS).toBe('/Off');
    expect(acroFormFields[3].fieldName).toBe('questionId_row_index1');
    expect(acroFormFields[4].AS).toBe('/Off');
    expect(acroFormFields[5].AS).toBe('/index1');
});
test('Matrix dropdown with radiogroup showInMultipleColumns equals true', async () => {
    const json: any = {
        questions: [
            {
                titleLocation: 'hidden',
                type: 'matrixdropdown',
                name: 'matrixdropdown_radiogroup_multiplecolumns',
                columns: [
                    {
                        cellType: 'radiogroup',
                        showInMultipleColumns: true,
                        choices: ['A', 'B']
                    }
                ],
                rows: [' ']
            }
        ]
    };
    const survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    const controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
});