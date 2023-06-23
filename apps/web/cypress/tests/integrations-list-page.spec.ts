describe('Integrations List Page', function () {
  beforeEach(function () {
    cy.initializeSession().as('session');
  });

  const checkTableLoading = () => {
    cy.getByTestId('integration-name-cell-loading').should('have.length', 10).first().should('be.visible');
    cy.getByTestId('integration-provider-cell-loading').should('have.length', 10).first().should('be.visible');
    cy.getByTestId('integration-channel-cell-loading').should('have.length', 10).first().should('be.visible');
    cy.getByTestId('integration-environment-cell-loading').should('have.length', 10).first().should('be.visible');
    cy.getByTestId('integration-status-cell-loading').should('have.length', 10).first().should('be.visible');
  };

  const checkTableRow = (
    {
      name,
      isFree,
      key,
      provider,
      channel,
      environment,
      status,
    }: {
      name: string;
      isFree?: boolean;
      key: string;
      provider: string;
      channel: string;
      environment: string;
      status: string;
    },
    nth: number
  ) => {
    cy.getByTestId('integration-name-cell').eq(nth).should('be.visible').contains(name);
    // cy.getByTestId('integration-name-cell').eq(nth).should('be.visible').contains(key);
    if (isFree) {
      cy.getByTestId('integration-name-cell').eq(nth).should('be.visible').contains('Free');
    }
    cy.getByTestId('integration-provider-cell').eq(nth).should('be.visible').contains(provider);
    cy.getByTestId('integration-channel-cell').eq(nth).should('be.visible').contains(channel);
    cy.getByTestId('integration-environment-cell').eq(nth).should('be.visible').contains(environment);
    cy.getByTestId('integration-status-cell').eq(nth).should('be.visible').contains(status);
  };

  it('should show the table loading skeleton and empty state', () => {
    cy.intercept('*/integrations', {
      data: [],
      delay: 1000,
    }).as('getIntegrations');

    cy.visit('/integrations');
    cy.location('pathname').should('equal', '/integrations');

    cy.getByTestId('add-provider').should('be.disabled');
    cy.getByTestId('add-provider-label').should('be.visible').contains('Add a provider');
    checkTableLoading();

    cy.wait('@getIntegrations');

    cy.getByTestId('add-provider').should('be.enabled');
    cy.getByTestId('no-integrations-placeholder').should('be.visible');
    cy.contains('Choose a channel you want to start sending notifications');

    cy.getByTestId('integration-channel-card-in_app').should('be.enabled').contains('In-App');
    cy.getByTestId('integration-channel-card-email').should('be.enabled').contains('Email');
    cy.getByTestId('integration-channel-card-chat').should('be.enabled').contains('Chat');
    cy.getByTestId('integration-channel-card-push').should('be.enabled').contains('Push');
    cy.getByTestId('integration-channel-card-sms').should('be.enabled').contains('SMS');
  });

  it('should show the table loading skeleton and then table', function () {
    cy.intercept('*/integrations', async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }).as('getIntegrations');

    cy.visit('/integrations');
    cy.location('pathname').should('equal', '/integrations');

    cy.getByTestId('add-provider').should('be.disabled');
    cy.getByTestId('add-provider-label').should('be.visible').contains('Add a provider');
    checkTableLoading();

    cy.wait('@getIntegrations');

    checkTableRow(
      {
        name: 'Sendgrid',
        key: '',
        provider: 'Sendgrid',
        channel: 'Email',
        environment: 'Development',
        status: 'Active',
      },
      0
    );
    checkTableRow(
      {
        name: 'Twilio',
        key: '',
        provider: 'Twilio',
        channel: 'SMS',
        environment: 'Development',
        status: 'Active',
      },
      1
    );
    checkTableRow(
      {
        name: 'Slack',
        key: '',
        provider: 'Slack',
        channel: 'Chat',
        environment: 'Development',
        status: 'Active',
      },
      2
    );
    checkTableRow(
      {
        name: 'Discord',
        key: '',
        provider: 'Discord',
        channel: 'Chat',
        environment: 'Development',
        status: 'Active',
      },
      3
    );
    checkTableRow(
      {
        name: 'Fcm',
        key: '',
        provider: 'Fcm',
        channel: 'Push',
        environment: 'Development',
        status: 'Active',
      },
      4
    );
    checkTableRow(
      {
        name: 'Novu',
        isFree: true,
        key: '',
        provider: 'Novu',
        channel: 'In-App',
        environment: 'Development',
        status: 'Active',
      },
      5
    );
  });
});
