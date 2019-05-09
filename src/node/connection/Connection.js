/* eslint-disable node/no-extraneous-require */
const tunnel = require('tunnel');
const FormData = require('form-data');
const https = require('https');

const CONNECTION_CONST = require('./constant');
const packageFile = require('../../../package.json');
const BaseConnection = require('../../base/main').Connection;

const CONTENT_TYPE_KEY = 'Content-Type';

class Connection extends BaseConnection {
  /**
     * @param {String} domain
     * @param {Auth} auth
     * @param {Number} guestSpaceID
     */

  constructor(domain, auth, guestSpaceID) {
    super(domain, auth, guestSpaceID);
    this.domain = domain;
    this.guestSpaceID = parseInt(guestSpaceID, 10);

    this.headers = [];
    this.options = {};

    this.setAuth(auth);
    this.addRequestOption(CONNECTION_CONST.BASE.PROXY, false);
    this.setClientCert();

    // set default user-agent
    this.setHeader(
      CONNECTION_CONST.BASE.USER_AGENT,
      CONNECTION_CONST.BASE.USER_AGENT_BASE_VALUE
        .replace('{name}',
          packageFile.name || 'kintone-nodejs-sdk')
        .replace('{version}', packageFile.version || '(none)')
    );

  }

  /**
   * Set certificate for request by data
   * @param {String} proxyHost
   * @param {String} proxyPort
   * @return {this}
   */
  setClientCert() {
    if (!this.auth.getClientCertData()) {
      return;
    }
    const httpsAgent = new https.Agent({
      pfx: this.auth.getClientCertData(),
      passphrase: this.auth.getPassWordCert()
    });
    this.addRequestOption(CONNECTION_CONST.BASE.HTTPS_AGENT, httpsAgent);
  }

  /**
   * Set proxy for request
   * @param {String} proxyHost
   * @param {String} proxyPort
   * @return {this}
   */
  setProxy(proxyHost, proxyPort) {
    const option = {
      proxy: {host: proxyHost, port: proxyPort}
    };

    if (this.auth.getClientCertData()) {
      option.pfx = this.auth.getClientCertData();
      option.passphrase = this.auth.getPassWordCert();
    }
    const httpsAgent = tunnel.httpsOverHttp(option);
    this.addRequestOption(CONNECTION_CONST.BASE.HTTPS_AGENT, httpsAgent);
    return this;
  }

  /**
   * upload file to kintone
   * @param {String} fileName
   * @param {String} fileContent
   * @return {Promise}
   */
  upload(fileName, fileContent) {
    const formData = new FormData();
    formData.append('file', fileContent, fileName);

    this.setHeader(CONTENT_TYPE_KEY, formData.getHeaders()['content-type']);
    return this.requestFile('POST', 'FILE', formData);
  }
}
module.exports = Connection;