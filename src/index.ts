import { exec } from 'child_process';
import { readFileSync } from 'fs';
import path from 'path';
import YAML from 'yaml';
import inquirer from 'inquirer';

interface BaseIpconfig {
  netname: string;
  ipconfig: Ipconfig[];
}

interface Ipconfig {
  name: string;
  ip: string;
  subnetMask: string;
  defaultGateway: string;
  dns: string;
}

function useCommand(command: string) {
  console.log(command);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

export async function reset(netname: string) {
  const reset_cmd = `netsh interface ip set address "${netname}" dhcp `;
  const reset_dns = `netsh interface ip set dns "${netname}" dhcp`;
  await useCommand(reset_cmd);
  await useCommand(reset_dns);
}

export async function set(netname: string, config: Ipconfig) {
  const cmd_ip = `netsh interface ip set address "${netname}" static ${config.ip} ${config.subnetMask} gateway=${config.defaultGateway} gwmetric=0`;
  const cmd_dns = config.dns
    ? `netsh interface ip set dns "${netname}" static ${config.dns}`
    : `netsh interface ip set dns "${netname}" dhcp`;
  const cmd = `${cmd_ip} && ${cmd_dns}`;
  useCommand(cmd);
}

async function test() {
  let buffer = readFileSync(path.join(__dirname, 'config.yaml'), 'utf8');
  let config = YAML.parse(buffer) as BaseIpconfig;

  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'use_auto_ip',
        message: '是否修改为自动获取IP?',
      },
      {
        type: 'list',
        name: 'ip_choice',
        message: '请选择你需要切换的ipconfig?',
        when(a) {
          return a.use_auto_ip == false;
        },
        choices: config.ipconfig.map((e, i) => {
          return {
            ...e,
            key: i,
            name: e.name,
            value: i,
          };
        }),
      },
    ])
    .then((a) => {
      const { ip_choice, use_auto_ip } = a;
      if (use_auto_ip) {
        reset(config.netname);
      } else {
        set(config.netname, config.ipconfig[ip_choice]);
      }
    });
}
test();
// inquirer
//   .prompt([
//     {
//       type: 'list',
//       name: 'outerList',
//       message: 'Select an item from the outer list:',
//       choices: [
//         'Item 1',
//         'Item 2',
//         new inquirer.Separator(),
//         {
//           name: 'Nested list',
//           value: {
//             isNestedList: true,
//             choices: ['Nested Item 1', 'Nested Item 2'],
//           },
//         },
//       ],
//     },
//     {
//       type: 'list',
//       name: 'nestedList',
//       message: 'Select an item from the nested list:',
//       choices: function (answers) {
//         if (answers.outerList.isNestedList) {
//           return answers.outerList.choices;
//         } else {
//           return [];
//         }
//       },
//       when: function (answers) {
//         return answers.outerList.isNestedList;
//       },
//     },
//   ])
//   .then((answers) => {
//     console.log(answers);
//   });
