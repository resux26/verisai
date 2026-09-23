const fs = require('fs');
const files = [
  'app/token/page.tsx',
  'app/u/[username]/page.tsx',
  'app/career/page.tsx',
  'app/career/templates/page.tsx',
  'app/career/templates/[id]/page.tsx',
  'app/proof/page.tsx',
  'app/leaderboard/page.tsx',
  'app/verify/page.tsx',
  'app/verify/[id]/page.tsx',
  'components/proof/ProofCard.tsx',
  'app/dashboard/templates/new/page.tsx',
  'app/dashboard/templates/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // app/token/page.tsx specific
    content = content.replace("title: 'CREXTO Token | Demo Utility Ecosystem'", "title: 'CREXTO Token | Utility Ecosystem'");
    content = content.replace("{tokenConfig.is_demo ? 'Demo Token Economy' : 'Token Ecosystem'}", "{tokenConfig.is_demo ? 'Token Economy' : 'Token Ecosystem'}");
    content = content.replace("Demo Economy Notice", "Economy Notice");
    content = content.replace("Demo Tokens", "Tokens");
    content = content.replace("demo tokens", "tokens");
    content = content.replace("demo CRX tokens", "CRX tokens");
    content = content.replace("For the current MVP, Crexto does NOT have a real deployed token on mainnet. All CRX tokens displayed on leaderboards and profiles are simulated test tokens.", "Tokens displayed on leaderboards and profiles are test tokens.");

    // badges
    content = content.replace(/{profile\.is_demo && <Badge variant="outline" className="text-xs">Demo User<\/Badge>}/g, "");
    content = content.replace(/<Badge variant="secondary" className="text-\[10px\] bg-black\/50 backdrop-blur text-white border-white\/10">Demo<\/Badge>/g, "");
    content = content.replace(/<Badge variant="secondary" className="bg-black\/70 backdrop-blur border-white\/20 text-white">Demo Template<\/Badge>/g, "");
    content = content.replace(/<Info className="w-3 h-3 mr-1\.5" \/> Demo community data/g, "");
    content = content.replace(/{proof\.isDemo && <Badge variant="demo" className="text-\[10px\] py-0\.5 px-2">Demo<\/Badge>}/g, "");
    content = content.replace(/{isDemo && <Badge variant="demo">Demo Data<\/Badge>}/g, "");
    
    // demo mode text
    content = content.replace("<strong>Demo Mode:</strong> The Gemini API key is not configured", "<strong>Preview Mode:</strong> The Gemini API key is not configured");
    content = content.replace("<strong>Demo Mode:</strong> You are seeing sample analysis data", "<strong>Preview Mode:</strong> You are seeing sample analysis data");
    content = content.replace("Demo Proof", "Sample Proof");
    
    fs.writeFileSync(file, content);
  }
});
