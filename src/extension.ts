import * as vscode from 'vscode';
import { buildExtension } from './vscode-adapters/extension-init';
import { GoToTestVsCodeNS } from './vscode-adapters/types';

const extension = buildExtension((vscode as unknown) as GoToTestVsCodeNS);
export const activate = extension.activate;
