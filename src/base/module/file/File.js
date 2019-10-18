import common from '../../utils/Common';
import FileModel from '../../model/file/FileModels';
import Connection from '../../connection/Connection';
import KintoneAPIException from '../../exception/KintoneAPIException';

/**
 * File module
 */
class File {
  /**
   * The constructor for this module
   * @param {Object} params
   * @param {Connection} params.connection
   */
  constructor({connection} = {}) {
    if (!(connection instanceof Connection)) {
      throw new KintoneAPIException(`${connection} is not an instance of Connection`);
    }
    this.connection = connection;
  }

  /**
   * check required arguments
   *
   * @param {Object} params
   * @returns {Promise<Boolean>}
   */
  _validateRequiredArgs(params) {
    return new Promise((resolve, reject) => {
      try {
        common.validateRequiredArgs(params);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Download file from kintone
   * @param {Object} params
   * @param {String} params.fileKey
   * @return {Promise}
   */
  download({fileKey}) {
    const dataRequest =
              new FileModel.GetFileRequest(fileKey);
    return this.connection.download(dataRequest.toJSON());
  }
  /**
   * upload file to kintone
   * @param {Object} params
   * @param {String} params.fileName
   * @param {String} params.fileContent
   * @return {Promise}
   */
  upload({fileName, fileContent}) {
    return this._validateRequiredArgs({
      fileName,
      fileContent
    }).then(() => {
      return this.connection.upload(fileName, fileContent);
    });
  }
}
export default File;
