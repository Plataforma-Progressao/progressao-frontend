const { execSync } = require('child_process');
const fs = require('fs');

process.env.GIT_INDEX_FILE = '.git/temp-index';

try {
  execSync('git -c core.protectNTFS=false read-tree origin/main');
  const files = execSync('git ls-files -s').toString().split('\n').filter(l => l.includes('pages / configuracoes-home'));
  let fixed = '';
  let remove = '';
  
  for (const line of files) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const newPath = parts[1].replace('pages / configuracoes-home', 'pages/configuracoes-home');
    fixed += parts[0] + '\t' + newPath + '\n';
    remove += '0 0000000000000000000000000000000000000000\t' + parts[1] + '\n';
  }
  
  fs.writeFileSync('fixed.txt', fixed);
  fs.writeFileSync('remove.txt', remove);
  
  execSync('git -c core.protectNTFS=false update-index --index-info < fixed.txt');
  execSync('git -c core.protectNTFS=false update-index --index-info < remove.txt');
  
  const tree = execSync('git -c core.protectNTFS=false write-tree').toString().trim();
  const commit = execSync('git commit-tree ' + tree + ' -p origin/main -m "Fix invalid path"').toString().trim();
  
  execSync('git branch -f fix-branch ' + commit);
  console.log('Success! Commit: ' + commit);
} catch (e) {
  console.error(e.message);
  if (e.stdout) console.error(e.stdout.toString());
  if (e.stderr) console.error(e.stderr.toString());
} finally {
  if (fs.existsSync('fixed.txt')) fs.unlinkSync('fixed.txt');
  if (fs.existsSync('remove.txt')) fs.unlinkSync('remove.txt');
  if (fs.existsSync('.git/temp-index')) fs.unlinkSync('.git/temp-index');
}
