// Terminal System Configuration
const CONFIG = {
    user: 'guest',
    hostname: 'AnaelRusso-server',
    cpu: 'AMD EPYC™ 9965 192 core CPU',
    ram: '1500GB',
    gpu: 'NVIDIA GB200 NVL72 36 Grace CPU : 72 Blackwell GPUs',
    pwd: '/home/guest',
    currentDirectory: '/home/guest'
};

// Command History Management
let commandHistory = [];
let historyIndex = -1;

// System Messages
const bootMessages = [
    '[    0.000000] Linux version 6.5.0-generic',
    '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.5.0-generic',
    '[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: x87 floating point registers',
    `[    0.000000] CPU: ${CONFIG.cpu}`,
    `[    0.000000] Memory: ${CONFIG.ram} available`,
    `[    0.000000] GPU: ${CONFIG.gpu}`,
    '[    2.027331] systemd[1]: Reached target Basic System.',
    '[    2.028150] systemd[1]: Reached target Login Prompts.',
    `[    2.029022] systemd[1]: Started User Login Management.`,
    '',
    'Welcome to Terminal OS 1.0.0 LTS',
    '',
    `${CONFIG.user}@${CONFIG.hostname} terminal`,
    'Type "help" for available commands',
    ''
].join('\n');

// File System Simulation
const fileSystem = {
    '/home/guest': {
        'about.txt': 'IT Sysadmin with PenTesting Skills ⚙️🔥 IT Security Expert 🧬⚡️ Enhancing Network Security & Performance ⚙️🔒🌐 Protecting Data and Optimizing IT Infrastructure 💡🔐',
        'skills.txt': 'Technical Aptitude, Hacker Mindset, Root Cause Analysis, Documenting operational procedures, Ability to Multitask, Ability to Work Under Pressure',
        'contact.txt': 'LinkedIn and GitHub',
        'projects.txt': 'Find my Projects on GitHub',
        'education.txt': 'Two Courses at See-Security College, Bachelor of Education - BEd: High School Track: English specialty.',
        'experience.txt': 'IT Sysadmin',
        '.hidden1': '',
        '.hidden2': '',
        '.config': ''
    }
};

// Initialize Terminal
document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('output');
    const input = document.getElementById('command-input');

    output.textContent = bootMessages;
    input.addEventListener('keydown', handleCommand);
    input.addEventListener('keyup', handleHistory);

    document.querySelector('.terminal').addEventListener('click', () => {
        input.focus();
    });
});

// Command Handler
function handleCommand(e) {
    if (e.key !== 'Enter') return;

    const input = e.target;
    const command = input.value.trim();

    if (command) {
        commandHistory.unshift(command);
        historyIndex = -1;
        executeCommand(command);
    }

    input.value = '';
}

// Command History Navigation
function handleHistory(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory(e.key === 'ArrowUp' ? 1 : -1);
    }
}

function navigateHistory(direction) {
    if (commandHistory.length === 0) return;

    historyIndex = Math.min(Math.max(-1, historyIndex + direction), commandHistory.length - 1);
    const input = document.getElementById('command-input');
    input.value = historyIndex === -1 ? '' : commandHistory[historyIndex];
}

// Command Execution
function executeCommand(command) {
    const output = document.getElementById('output');
    const prompt = `${CONFIG.user}@${CONFIG.hostname}:${CONFIG.pwd}$ ${command}\n`;
    const result = getCommandOutput(command);

    output.textContent += prompt + result + '\n';
    output.scrollTop = output.scrollHeight;
}

// Helper Functions
function getFileList(showHidden = false) {
    const files = Object.keys(fileSystem[CONFIG.currentDirectory]);
    return showHidden ? files : files.filter(f => !f.startsWith('.'));
}

// Command Output Generator
function getCommandOutput(command) {
    const [cmd, ...args] = command.toLowerCase().split(' ');

    const commands = {
        help: () => 'Available commands:\n' +
            'ls [-a | -all]: List directory contents\n' +
            'pwd: Print working directory\n' +
            'cd [dir]: Change directory\n' +
            'echo [text]: Display a line of text\n' +
            'cat [file]: Concatenate files and print\n' +
            'man [command]: Display system manual pages\n' +
            'uname [-a]: Print system information\n' +
            'whoami: Print effective user name\n' +
            'head [file]: Output the first part of files\n' +
            'tail [file]: Output the last part of files\n' +
            'grep [pattern] [file]: Search for patterns\n' +
            'ps: Report process status\n' +
            'top: Display system processes\n' +
            'df: Report file system disk space usage\n' +
            'ifconfig: Configure network interface\n' +
            'sudo: Execute a command as superuser\n' +
            'ping [host]: Send ICMP ECHO_REQUEST\n' +
            'netstat: Network statistics\n' +
            'clear: Clear terminal screen',

        ls: () => {
            const showHidden = args.includes('-a') || args.includes('-all');
            return getFileList(showHidden).join('  ');
        },

        pwd: () => CONFIG.pwd,

        cd: () => {
            if (!args[0] || args[0] === '~') {
                CONFIG.currentDirectory = '/home/guest';
                CONFIG.pwd = '~';
            }
            return '';
        },

        echo: () => args.join(' '),

        cat: () => {
            if (!args[0]) return 'Usage: cat [file]';
            const file = fileSystem[CONFIG.currentDirectory][args[0]];
            return file !== undefined ? file : `cat: ${args[0]}: No such file or directory`;
        },

        man: () => {
            if (!args[0]) return 'What manual page do you want?';
            return `Manual page for ${args[0]}`;
        },

        uname: () => {
            if (args[0] === '-a') {
                return `Linux ${CONFIG.hostname} 6.5.0-generic x86_64 GNU/Linux`;
            }
            return 'Linux';
        },

        whoami: () => CONFIG.user,

        head: () => {
            if (!args[0]) return 'Usage: head [file]';
            const file = fileSystem[CONFIG.currentDirectory][args[0]];
            return file !== undefined ? file.split('\n').slice(0, 10).join('\n') : `head: ${args[0]}: No such file or directory`;
        },

        tail: () => {
            if (!args[0]) return 'Usage: tail [file]';
            const file = fileSystem[CONFIG.currentDirectory][args[0]];
            return file !== undefined ? file.split('\n').slice(-10).join('\n') : `tail: ${args[0]}: No such file or directory`;
        },

        grep: () => {
            if (args.length < 2) return 'Usage: grep [pattern] [file]';
            const file = fileSystem[CONFIG.currentDirectory][args[1]];
            if (file === undefined) return `grep: ${args[1]}: No such file or directory`;
            const matches = file.split('\n').filter(line => line.includes(args[0]));
            return matches.join('\n');
        },

        ps: () => 'PID TTY          TIME CMD\n 1 ?        00:00:00 systemd\n 2 ?        00:00:00 portfolio\n 3 ?        00:00:00 terminal',

        top: () => {
            const time = new Date().toLocaleTimeString();
            return `top - ${time}
Tasks: 3 total, 1 running, 2 sleeping
%Cpu(s): 2.4 us, 1.2 sy, 0.0 ni, 96.3 id
MiB Mem : ${CONFIG.ram} total, 8256 free, 12458 used, 3286 buff/cache
MiB Swap: 2048 total, 2048 free, 0 used

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
    1 root      20   0  168944  11844   8416 S   0.0   0.1   0:00.09 systemd
    2 guest     20   0   26368   7604   6756 S   0.0   0.0   0:00.00 portfolio
    3 guest     20   0   28656   8228   7100 R   0.0   0.0   0:00.00 terminal`;
        },

        df: () => `Filesystem     1K-blocks      Used Available Use% Mounted on
/dev/nvme0n1p1  2097152000 1034485760 958722048  52% /
tmpfs            ${parseInt(CONFIG.ram)}     8388608         0 100% /dev/shm`,

        ifconfig: () => `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 00:00:5e:00:53:af  txqueuelen 1000  (Ethernet)
        RX packets 2859  bytes 864321 (864.3 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 1521  bytes 317456 (317.4 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`,

        sudo: () => 'guest is not in the sudoers file. This incident will be reported.',

        ping: () => {
            if (!args[0]) return 'Usage: ping [host]';
            return `PING ${args[0]} (8.8.8.8) 56(84) bytes of data.
64 bytes from ${args[0]}: icmp_seq=1 ttl=54 time=8.43 ms
64 bytes from ${args[0]}: icmp_seq=2 ttl=54 time=8.68 ms`;
        },

        netstat: () => `Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 localhost:51724         localhost:8080          ESTABLISHED
tcp        0      0 localhost:8080          localhost:51724         ESTABLISHED`,

        clear: () => {
            setTimeout(() => {
                document.getElementById('output').textContent = bootMessages;
            }, 0);
            return '';
        }
    };

    return commands[cmd]?.() || `Command '${cmd}' not found. Type 'help' for available commands.`;
}
