import sourceCode from '../../src/package1/source.code';

if (sourceCode() !== 'to be tested') {
  throw new Error('Test Failed');
}
