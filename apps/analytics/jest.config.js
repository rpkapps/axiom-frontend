module.exports = {
  name: 'analytics',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/analytics',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
