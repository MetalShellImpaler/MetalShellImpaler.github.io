document.addEventListener('DOMContentLoaded', () => {
  const terminalOutput = document.getElementById('terminal-output');
  const inputLine = document.getElementById('input-line');
  const commands = {
    clear: () => (terminalOutput.innerHTML = ''),
    help: () => `Available commands:\n${Object.keys(commands).join(', ')}`,
    whoami: () => 'User: Anael Russo\nRole: IT Professional and Penetration Tester',
    uname: () => 'Linux portfolio-machine 5.15.0-46-generic #49~20.04 SMP x86_64 GNU/Linux',
    ls: () => 'about.txt   skills.txt   projects/   blog/',
    cd: (args) => (args[0] === 'projects' ? 'Moved to /projects/' : 'Directory not found'),
    cat: (args) => {
      if (args[0] === 'about.txt') return 'Welcome to Anael Russo\'s IT Portfolio!';
      return 'File not found';
    },
    history: () => commandHistory.join('\n'),
    mkdir: (args) => `Created directory: ${args[0] || 'new-folder'}`,
    ping: () => 'Pinging localhost (127.0.0.1) with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=64',
    df: () => 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1       50G   20G   30G  40% /',
    ps: () => 'PID TTY          TIME CMD\n1   ?        00:00:00 init\n1234 pts/0    00:00:01 bash',
    echo: (args) => args.join(' '),
    uptime: () => '14:37:42 up 1:42,  2 users,  load average: 0.00, 0.01, 0.05',
    top: () => 'Tasks:  86 total,   1 running,  85 sleeping,   0 stopped,   0 zombie\n%CPU: 1.2%  %MEM: 4.5%',
    touch: (args) => `Created file: ${args[0] || 'newfile.txt'}`,
  };
  const commandHistory = [];

  inputLine.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const input = inputLine.value.trim();
      commandHistory.push(input);
      inputLine.value = '';

      const [command, ...args] = input.split(' ');
      const output = commands[command]
        ? commands[command](args)
        : `${command}: command not found`;

      // Append input and output to terminal output
      terminalOutput.innerHTML += `<div><span class="prompt">$</span> ${input}</div>`;
      terminalOutput.innerHTML += `<div>${output}</div>`;

      // Automatically scroll to the bottom of the output
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });
});
