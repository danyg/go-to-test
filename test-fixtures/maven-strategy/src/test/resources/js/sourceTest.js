import sourceCode from '../../main/resources/js/source';

if (sourceCode() !== 'to be tested') {
  throw new Error('Test Failed');
}
