import * as assert from 'assert';
import * as path from 'path';
import { isSupportedFileExtension } from './helpers/isSupportedFileExtension';
import { isSupportedLanguageId } from './helpers/isSupportedLanguageId';

suite('isSupportedFileExtension', () => {
  test('returns true for supported extensions', () => {
    assert.strictEqual(isSupportedFileExtension('.js'), true);
    assert.strictEqual(isSupportedFileExtension('.ts'), true);
    assert.strictEqual(isSupportedFileExtension('.jsx'), true);
    assert.strictEqual(isSupportedFileExtension('.tsx'), true);
    assert.strictEqual(isSupportedFileExtension('.mjs'), true);
    assert.strictEqual(isSupportedFileExtension('.cjs'), true);
    assert.strictEqual(isSupportedFileExtension('.mts'), true);
    assert.strictEqual(isSupportedFileExtension('.cts'), true);
    assert.strictEqual(isSupportedFileExtension('.astro'), true);
    assert.strictEqual(isSupportedFileExtension('.svelte'), true);
    assert.strictEqual(isSupportedFileExtension('.vue'), true);
  });

  test('returns false for unsupported extensions', () => {
    assert.strictEqual(isSupportedFileExtension('.py'), false);
    assert.strictEqual(isSupportedFileExtension('.java'), false);
    assert.strictEqual(isSupportedFileExtension('.cpp'), false);
    assert.strictEqual(isSupportedFileExtension('.go'), false);
    assert.strictEqual(isSupportedFileExtension('.rs'), false);
    assert.strictEqual(isSupportedFileExtension('.json'), false);
    assert.strictEqual(isSupportedFileExtension('.html'), false);
    assert.strictEqual(isSupportedFileExtension('.css'), false);
  });

  test('handles edge cases', () => {
    assert.strictEqual(isSupportedFileExtension(''), false);
    assert.strictEqual(isSupportedFileExtension('.JS'), false);
    assert.strictEqual(isSupportedFileExtension('.TS'), false);
  });
});

suite('isSupportedLanguageId', () => {
  test('returns true for supported language ids', () => {
    assert.strictEqual(isSupportedLanguageId('javascript'), true);
    assert.strictEqual(isSupportedLanguageId('javascriptreact'), true);
    assert.strictEqual(isSupportedLanguageId('typescript'), true);
    assert.strictEqual(isSupportedLanguageId('typescriptreact'), true);
    assert.strictEqual(isSupportedLanguageId('astro'), true);
    assert.strictEqual(isSupportedLanguageId('svelte'), true);
    assert.strictEqual(isSupportedLanguageId('vue'), true);
  });

  test('returns false for unsupported language ids', () => {
    assert.strictEqual(isSupportedLanguageId('python'), false);
    assert.strictEqual(isSupportedLanguageId('java'), false);
    assert.strictEqual(isSupportedLanguageId('go'), false);
    assert.strictEqual(isSupportedLanguageId('rust'), false);
    assert.strictEqual(isSupportedLanguageId('json'), false);
    assert.strictEqual(isSupportedLanguageId('html'), false);
    assert.strictEqual(isSupportedLanguageId('css'), false);
  });

  test('is case sensitive', () => {
    assert.strictEqual(isSupportedLanguageId('Javascript'), false);
    assert.strictEqual(isSupportedLanguageId('TypeScript'), false);
  });
});

suite('Extension Command Logic', () => {
  const variableRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

  test('variable regex accepts valid identifiers', () => {
    assert.strictEqual(variableRegex.test('foo'), true);
    assert.strictEqual(variableRegex.test('bar'), true);
    assert.strictEqual(variableRegex.test('_private'), true);
    assert.strictEqual(variableRegex.test('$special'), true);
    assert.strictEqual(variableRegex.test('camelCase'), true);
    assert.strictEqual(variableRegex.test('PascalCase'), true);
    assert.strictEqual(variableRegex.test('withNumbers123'), true);
    assert.strictEqual(variableRegex.test('with_underscore'), true);
    assert.strictEqual(variableRegex.test('$'), true);
    assert.strictEqual(variableRegex.test('_'), true);
  });

  test('variable regex rejects invalid identifiers', () => {
    assert.strictEqual(variableRegex.test('123'), false);
    assert.strictEqual(variableRegex.test('foo-bar'), false);
    assert.strictEqual(variableRegex.test('foo.bar'), false);
    assert.strictEqual(variableRegex.test('foo bar'), false);
    assert.strictEqual(variableRegex.test(''), false);
    assert.strictEqual(variableRegex.test('foo.bar()'), false);
  });

  test('path.extname extracts file extensions correctly', () => {
    assert.strictEqual(path.extname('file.js'), '.js');
    assert.strictEqual(path.extname('file.ts'), '.ts');
    assert.strictEqual(path.extname('file.jsx'), '.jsx');
    assert.strictEqual(path.extname('file.tsx'), '.tsx');
    assert.strictEqual(path.extname('file.vue'), '.vue');
    assert.strictEqual(path.extname('file.svelte'), '.svelte');
    assert.strictEqual(path.extname('.hiddenrc.js'), '.js');
    assert.strictEqual(path.extname('noextension'), '');
    assert.strictEqual(path.extname('path/to/file.ts'), '.ts');
  });

  test('combined extension and language check works correctly', () => {
    const jsExt = path.extname('file.js');
    const pyExt = path.extname('file.py');

    assert.strictEqual(isSupportedFileExtension(jsExt), true);
    assert.strictEqual(isSupportedFileExtension(pyExt), false);

    assert.strictEqual(
      isSupportedLanguageId('javascript') || isSupportedFileExtension(jsExt),
      true
    );
    assert.strictEqual(
      isSupportedLanguageId('python') || isSupportedFileExtension(pyExt),
      false
    );
  });
});

suite('Console Log Format', () => {
  test('console log format is correct', () => {
    const varName = 'myVariable';
    const indentation = '  ';
    const expectedLog = `${indentation}console.log('🐸 ${varName}:', ${varName});`;

    assert.strictEqual(expectedLog, '  console.log(\'🐸 myVariable:\', myVariable);');
  });

  test('console log format with empty varName', () => {
    const varName = '';
    const indentation = '';
    const expectedLog = `${indentation}console.log('🐸 ${varName}:', ${varName});`;

    assert.strictEqual(expectedLog, 'console.log(\'🐸 :\', );');
  });
});
