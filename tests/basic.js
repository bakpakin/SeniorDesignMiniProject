module.exports = {
  tags: ['basic'],
  'Login Test': function (client) {
    client.url('http://localhost:5000/login')
      .waitForElementVisible('body', 1000)
      .assert.title('Senior Design Mini Project')
      .execute(function(){hiddenLogin()})
      .waitForElementVisible('#app-container', 10000)
      .waitForElementVisible('#insert1', 4000)
      .assert.visible('#insert1')
      .assert.visible('#insert2')
      .assert.visible('#insert3')
      .assert.visible('#insert4')
      .assert.visible('#insert5')
      .assert.visible('#insert6')
      .assert.visible('#insert7')
      .assert.visible('#insert8')
      .assert.visible('#insert9')
      .end();
  }
};  
