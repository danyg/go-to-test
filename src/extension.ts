import * as vscode from 'vscode';
import { buildExtension } from './vscode-adapters/extension-init';

const extension = buildExtension(vscode);
export const activate = extension.activate;
