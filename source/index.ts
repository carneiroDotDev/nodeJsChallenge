const crypt = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');

function aufgabe1({ file, password }): void {
    
  // Noted only in the end that there was an iv.txt
  const readInitVect = fs.createReadStream(file, { end: 31 });

  let initVect: string;
  readInitVect.on('data', (chunk: string): void => {
    initVect = chunk;
  });

  readInitVect.on('close', () => {
    const readStream = fs.createReadStream(file, { start: 32 });
    const decipher = crypt.createDecipheriv('aes256', password, initVect);
    const unzip = zlib.createUnzip();
    const writeStream = fs.createWriteStream(file + '.unenc');

    readStream
      .pipe(decipher)
      .pipe(unzip)
      .pipe(writeStream);
  });
}

// aufgabe1({
//     file: __dirname + '/../secret.key',
//     password: '3e95f53a2e0bc1495dc266973eaba8767f53b3f916bc1d94d7c67dabcc5a0dd1'
// })

const aufgabe2 = fs.readFileSync(__dirname + '/../clear_smaller.txt', 'utf-8')
    .split(' ')
    .reduce( (count: number, word: string): number => {
                const numberInWord = word.replace(/\D/g,'')
                if(numberInWord){
                    count += Number(numberInWord)
                 }
                return count
        }, 0);

function aufgabe3(file: string): number {
    let total = 0
    let map = {
        'a': 2,
        'e': 4,
        'i': 8,
        'o': 16,
        'u': 32
    }

    fs.readFileSync(file, 'utf-8')
    .split('')
    .map( (letter: string): void => {
            if(map[letter]) total += map[letter]
        })

    return total + aufgabe2
}

aufgabe3(__dirname + '/../clear_smaller.txt')

function aufgabe4(file: string): void {

    const paragraphs = fs.readFileSync(file, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map( (paragraph: string): string[] => paragraph.split(' ').filter( word => word.replace(/\D/g,'')))
    .filter( (arr: string[]) => arr.length)

    console.log(paragraphs)
}

aufgabe4(__dirname + '/../clear_smaller.txt')