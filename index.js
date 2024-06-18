const readline = require('readline');
const { Client } = require("discord.js-selfbot-v13");
const client = new Client();
const delay = ms => new Promise(res => setTimeout(res, ms));
const fs = require('fs');

process.title = 'Young Multi-tool';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const colors = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  purple: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m"
};

const colorful = (color, string, reset = '\x1b[0m') => color + string + reset;

const banner = `
██╗░░░██╗░█████╗░██╗░░░██╗███╗░░██╗░██████╗░  ░██████╗████████╗░█████╗░██████╗░░██████╗
╚██╗░██╔╝██╔══██╗██║░░░██║████╗░██║██╔════╝░  ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝
░╚████╔╝░██║░░██║██║░░░██║██╔██╗██║██║░░██╗░  ╚█████╗░░░░██║░░░███████║██████╔╝╚█████╗░
░░╚██╔╝░░██║░░██║██║░░░██║██║╚████║██║░░╚██╗  ░╚═══██╗░░░██║░░░██╔══██║██╔══██╗░╚═══██╗
░░░██║░░░╚█████╔╝╚██████╔╝██║░╚███║╚██████╔╝  ██████╔╝░░░██║░░░██║░░██║██║░░██║██████╔╝
░░░╚═╝░░░░╚════╝░░╚═════╝░╚═╝░░╚══╝░╚═════╝░  ╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═════╝░`;

client.once('ready', () => {
  console.clear();
  showMenu();
});

const showMenu = () => {
  console.log(colorful(colors.red, banner));
  console.log(colorful(colors.red, '     [=] Escolha uma função:'));
  console.log("");
  console.log(colorful(colors.green, '     [1] Divulgar Servidor.'));
  console.log(colorful(colors.green, '     [2] Atualizar Token.'));
  console.log(colorful(colors.green, '     [3] Fechar.'));
  console.log("");

  rl.question('     [-] Escolha de acordo com o numero:  ', (choice) => {
    switch (choice) {
      case '1': getInput(); break;
      case '2': updateToken(); break;
      case '3': process.exit(); break;
      default: console.log('Escolha apenas as funcao acima.'); showMenu();
    }
  });
};

function getBlacklistedIDs() {
  try {
    const data = fs.readFileSync('./settings/blacklist.txt', 'utf8');
    return data.split('\n').map(id => id.trim()).filter(id => id);
  } catch (err) {
    console.error('Erro ao ler o arquivo blacklist.txt:', err);
    return [];
  }
}

let count = 0;

const getInput = () => {
  console.clear();
  console.log(colorful(colors.red, banner));
  console.log("");
  rl.question('     [+] Digite o ID do servidor: ', async (guildId) => {
    const guild = await client.guilds.fetch(guildId).catch(() => null);
    if (guild) {
      try {
        const members = await guild.members.fetch();
        const memberIDs = members.map(member => member.user.id);
        fs.writeFileSync('./settings/membros.txt', memberIDs.join('\n'), 'utf-8');
        for (let i = 0; i < 3; i++) {
          console.clear();
          console.log(colorful(colors.red, banner));
          console.log(colorful(colors.green, '     Carregando' + '.'.repeat(i + 1)));
          await delay(1000);
        }
        console.clear();
        console.log(colorful(colors.red, banner));
        console.log(colorful(colors.green, '     Carregando...'));
        console.clear();
        console.log(colorful(colors.red, banner));
        console.log("");
        
        await delay(5000);
        const blacklistedIDs = getBlacklistedIDs();
        for (const userID of memberIDs) {
          try {
            if (userID === client.user.id) {
              continue;
            }
        
            if (blacklistedIDs.includes(userID)) {
              console.log(`     [!] ID ${userID} está na blacklist, pulando...`);
              continue;
            }
        
            const user = await client.users.fetch(userID);
            const msg = fs.readFileSync('./settings/mensagem.txt', 'utf8').trim();
            if (!msg) {
              console.log(colorful(colors.red, banner));
              console.log(colorful(colors.red, '     [x] Mensagem Indefinida.'));
              return;
            }
            await user.send(msg);
            console.log(colorful(colors.green, `     [+] Mensagem enviada para ${user.username}.`));
            count++;
            await delay(5000);
          } catch (err) {
            console.error(colorful(colors.red, `     [+] Erro ao enviar mensagem para ${userID}.`));
            await delay(5000);
          }
        }
        console.log(colorful(colors.green, `     [+] enviei mensagens para ${count}, retornando para o painel inicial`));
        await delay(5000);
        console.clear();
        showMenu(); 
      } catch (err) {
        console.error('Erro ao obter membros do servidor:', err);
      }
    } else {
      console.clear();
      console.log('Servidor não encontrado. Verifique se o ID do servidor está correto.');
    }
  });
};

const token = fs.readFileSync('./settings/token.txt', 'utf8').trim();
if (!token) {
  console.log(colorful(colors.red, banner));
  console.log(colorful(colors.red, '     [x] Token Inválida.'));
  updateToken();
} else {
  client.login(token).catch(() => { 
    console.log(colorful(colors.red, banner));
    console.log(colorful(colors.red, '     [x] Token Inválida.'));
    updateToken(); 
  });
}

const updateToken = () => {
  console.clear();
  console.log(colorful(colors.red, banner));
  console.log("");
  rl.question('     [+] Cole a Token do Bot: ', (token) => {
    fs.writeFileSync('token.txt', token);
    console.clear();
    console.log(colorful(colors.red, banner));
    console.log(colorful(colors.green, '     [+] Token salva com sucesso, voltando em 5 segundos.'));
    setTimeout(showMenu, 5000);
  });
};
