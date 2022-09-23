import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as puppeteer from 'puppeteer';

const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async addPosts() {
    const promise = [
      this.parseWebFirst(),
      this.parseWebSecond(),
      this.parseWebThird(),
    ];
    const [posts1, posts2, posts3] = await Promise.all(promise);
    return [...posts1, ...posts2, ...posts3];
  }

  private async openPage(url: string | undefined) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    if (!url) {
      throw new NotFoundException('Not found WEB_URL in env');
    }

    await page.goto(url);

    return { browser, page };
  }

  private async parseWebFirst() {
    const { browser, page } = await this.openPage(
      this.configService.get('FIRST_WEB_URL'),
    );

    await page.waitForSelector('.aubl_cont');

    const list = await page.evaluate(() => {
      const data = document.getElementsByClassName('aubl_cont');
      const items = data[0].getElementsByClassName('aubl_item') as any;
      const arrItems = Object.values(items);
      const arrayPosts = arrItems.map((item: any) => {
        return {
          title: item.childNodes[3].childNodes[1].innerText,
          description: item.childNodes[3].childNodes[3].innerText,
          date: item.childNodes[3].childNodes[5].childNodes[1].innerText,
          category: item.childNodes[3].childNodes[5].childNodes[3].innerText,
          previewImg: item.childNodes[1].childNodes[3].src,
          url:
            item.childNodes[1].attributes[0].baseURI.replace(/\/news\//g, '') +
            item.childNodes[1].attributes[0].value,
        };
      });
      return arrayPosts;
    });

    list.map((item) => {
      const date = item.date.split('|')[0].trim().split('.');
      item.date = new Date(`${date[2]}-${date[1]}-${date[0]}`);
      return item;
    });

    await browser.close();
    return list;
  }

  private async parseWebSecond() {
    const { browser, page } = await this.openPage(
      this.configService.get('SECOND_WEB_URL'),
    );

    await page.waitForSelector('.grid-cols-1');

    const list = await page.evaluate(() => {
      const data = document.getElementsByClassName('grid-cols-1');
      const items = data[0].getElementsByClassName('py-6') as any;
      console.log(items);
      const arrItems = Object.values(items);
      const arrayPosts = arrItems.map((item: any) => {
        return {
          title: item.childNodes[3].childNodes[1].outerText,
          description: item.childNodes[5].outerText,
          date: item.childNodes[1].childNodes[5].dateTime,
          category: 'Игровые новости',
          previewImg: item.childNodes[7].childNodes[1].childNodes[1].src,
          url: item.childNodes[3].childNodes[1].href,
        };
      });
      return arrayPosts;
    });

    await browser.close();
    return list;
  }

  private async parseWebThird() {
    const { browser, page } = await this.openPage(
      this.configService.get('THIRD_WEB_URL'),
    );

    await page.waitForSelector('.list-items');

    const list = await page.evaluate(() => {
      const data = document.getElementsByClassName('list-items');
      const items = data[0].getElementsByTagName('li') as any;
      console.log(items[0].children[0].children[2].children[0].children[0]);
      const arrItems = Object.values(items);
      const arrayPosts = arrItems.map((item: any) => {
        return {
          title: item.children[0].children[0].innerText,
          description: item.children[0].children[3].innerText,
          date: item.children[0].children[1].children[1].innerText,
          category: item.children[0].children[1].children[0].innerText,
          previewImg:
            'https://vgtimes.ru' +
            item.children[0].children[2].children[0].children[0].dataset.src,
          url: item.children[0].children[2].children[0].href,
        };
      });
      return arrayPosts;
    });

    list.map((item) => {
      if (item.date.includes('Сегодня')) {
        item.date = new Date();
      } else if (item.date.includes('Вчера')) {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        item.date = date;
      } else {
        item.date = this.parseDate(item.date);
      }
      return item;
    });

    await browser.close();
    return list;
  }

  private parseDate(dateRu: string) {
    const dateArray = dateRu.split(', ')[0].split(' ');
    const day = +dateArray[0] >= 10 ? dateArray[0] : '0' + dateArray[0];
    const month =
      MONTHS.indexOf(dateArray[1]) + 1 >= 10
        ? MONTHS.indexOf(dateArray[1]) + 1
        : '0' + (MONTHS.indexOf(dateArray[1]) + 1);
    return new Date(`${dateArray[2]}-${month}-${day}`);
  }
}
