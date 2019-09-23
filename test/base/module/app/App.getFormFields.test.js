import {URI, PASSWORD_AURH_HEADER, createPasswordAuthToCheck, createAppToSendRequest} from './common';
import nock from 'nock';

const APP_FORM_FIELD_API_ROUTE = '/k/v1/app/form/fields.json';
const APP_FORM_FIELD_PREVIEW_API_ROUTE = '/k/v1/preview/app/form/fields.json';

describe('Checking App.getFormFields', () => {
  it('verify call app function without params', () => {
    const appModule = createAppToSendRequest();
    return appModule.getFormFields().then((resp) => {
      // TODO: verify the resp
    }).catch((error) => {
      // TODO: verify the error
    });
  });

  it('should return the app form field base on full data', () => {
    const app = 10;
    const lang = 'en';
    const isPreview = false;
    const expectResult = {
      'properties': {
        'Text__single_line_1': {
          'type': 'SINGLE_LINE_TEXT',
          'code': 'Text__single_line_1',
          'label': 'Text (single-line)',
          'noLabel': false,
          'required': true,
          'unique': true,
          'maxLength': '64',
          'minLength': '0',
          'defaultValue': '',
          'expression': '',
          'hideExpression': false
        },
        'revision': '2'
      }
    };
    nock(URI)
      .get(APP_FORM_FIELD_API_ROUTE)
      .query({app, lang})
      .matchHeader(PASSWORD_AURH_HEADER, (authHeader) => {
        expect(authHeader).toBe(createPasswordAuthToCheck());
        return true;
      })
      .reply(200, expectResult);

    const appModule = createAppToSendRequest();
    const getFormFieldsResult = appModule.getFormFields({app, lang, isPreview});
    return getFormFieldsResult.then((rsp) => {
      expect(rsp).toMatchObject(expectResult);
    });
  });

  it('Verify the app form field with a pre-live settings is returned when setting isPreview true', () => {
    const app = 10;
    const lang = 'en';
    const isPreview = true;
    const expectResult = {
      'properties': {
        'Text__single_line_1': {
          'type': 'SINGLE_LINE_TEXT',
          'code': 'Text__single_line_1',
          'label': 'Text (single-line)',
          'noLabel': false,
          'required': true,
          'unique': true,
          'maxLength': '64',
          'minLength': '0',
          'defaultValue': '',
          'expression': '',
          'hideExpression': false
        },
      },
      'revision': '2'
    };
    nock(URI)
      .get(APP_FORM_FIELD_PREVIEW_API_ROUTE)
      .query({app, lang})
      .matchHeader(PASSWORD_AURH_HEADER, (authHeader) => {
        expect(authHeader).toBe(createPasswordAuthToCheck());
        return true;
      })
      .reply(200, expectResult);

    const appModule = createAppToSendRequest();
    const getFormFieldsResult = appModule.getFormFields({app, lang, isPreview});
    return getFormFieldsResult.then((rsp) => {
      expect(rsp).toMatchObject(expectResult);
    });
  });
});