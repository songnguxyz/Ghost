const {combineNonTransactionalMigrations, createAddColumnMigration} = require('../../utils');

module.exports = combineNonTransactionalMigrations(
    createAddColumnMigration('email_recipients', 'delivered_at_set_dttm', {
        type: 'dateTime',
        nullable: true
    }),
    createAddColumnMigration('email_recipients', 'opened_at_set_dttm', {
        type: 'dateTime',
        nullable: true
    }),
    createAddColumnMigration('email_recipients', 'failed_at_set_dttm', {
        type: 'dateTime',
        nullable: true
    })
);