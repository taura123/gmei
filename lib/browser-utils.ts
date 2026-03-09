import puppeteer from 'puppeteer-core';
import { existsSync } from 'fs';

const CHROME_PATHS = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Users\\' + (process.env.USERNAME || 'HP') + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome',
];

export function getChromePath(): string {
    if (process.env.CHROME_EXECUTABLE_PATH && existsSync(process.env.CHROME_EXECUTABLE_PATH)) {
        return process.env.CHROME_EXECUTABLE_PATH;
    }

    for (const p of CHROME_PATHS) {
        if (existsSync(p)) return p;
    }

    throw new Error('Chrome not found. Install Google Chrome or set CHROME_EXECUTABLE_PATH.');
}

export async function launchBrowser() {
    return await puppeteer.launch({
        executablePath: getChromePath(),
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--proxy-server="direct://"',
            '--proxy-bypass-list=*'
        ],
    });
}
