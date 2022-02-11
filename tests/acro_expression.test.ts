(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { DocController } from '../src/doc_controller';
import { FlatExpression } from '../src/flat_layout/flat_expression';
import { TestHelper } from '../src/helper_test';
let __dummy_ex = new FlatExpression(null, null, null);

test('Check expression left space padding', async () => {
    let json: any = {
        elements: [
            {
                type: 'expression',
                name: 'expleftpad',
                titleLocation: 'hidden',
                expression: '7'
            }
        ]
    };

    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let controller: DocController = new DocController(TestHelper.defaultOptions);
    await survey['renderSurvey'](controller);
    expect(controller.doc.internal.acroformPlugin
        .acroFormDictionaryRoot.Fields[0].value).toBe(
            ' ' + json.elements[0].expression);
});