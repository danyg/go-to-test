import * as vscode from 'vscode';
import { extensionInit } from './vscode-adapters/extension-init';

const extension = extensionInit(vscode);
export const activate = extension.activate;
