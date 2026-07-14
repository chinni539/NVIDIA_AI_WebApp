#!/usr/bin/env node

/**
 * Cloudflare Deployment Setup Script
 * Run: node setup.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
    console.log('\n🚀 Cloudflare Pages Deployment Setup\n');
    console.log('This script will help you configure your app for Cloudflare.\n');

    try {
        // Check if Node.js is installed
        console.log('✓ Node.js is installed\n');

        // Check package.json
        if (!fs.existsSync('package.json')) {
            console.error('✗ package.json not found. Run: npm install\n');
            process.exit(1);
        }
        console.log('✓ package.json found\n');

        // Get Cloudflare Account ID
        console.log('📋 To get your Account ID:');
        console.log('   1. Visit: https://dash.cloudflare.com/');
        console.log('   2. Scroll to bottom right → Your Account ID\n');
        
        const accountId = await question('Enter your Cloudflare Account ID: ');
        
        if (!accountId.match(/^[a-f0-9]+$/)) {
            console.error('\n✗ Invalid Account ID format\n');
            process.exit(1);
        }

        // Update wrangler.toml
        let wranglerContent = fs.readFileSync('wrangler.toml', 'utf-8');
        wranglerContent = wranglerContent.replace(
            'account_id = "YOUR_ACCOUNT_ID"',
            `account_id = "${accountId}"`
        );
        fs.writeFileSync('wrangler.toml', wranglerContent);
        console.log('\n✓ wrangler.toml updated\n');

        // Get NVIDIA API Key
        console.log('🔑 NVIDIA API Key:');
        const nvdiaKey = await question('Enter your NVIDIA API Key: ');
        
        if (!nvdiaKey) {
            console.error('✗ API Key is required\n');
            process.exit(1);
        }

        console.log('\n📝 Next steps:\n');
        console.log('1. Install Wrangler globally:');
        console.log('   npm install -g wrangler\n');

        console.log('2. Login to Cloudflare:');
        console.log('   wrangler login\n');

        console.log('3. Set your NVIDIA API Key:');
        console.log('   wrangler secret put NVIDIA_API_KEY');
        console.log(`   (Paste: ${nvdiaKey.substring(0, 10)}...)\n`);

        console.log('4. Test locally (optional):');
        console.log('   npm run dev\n');

        console.log('5. Deploy:');
        console.log('   npm run deploy\n');

        console.log('✅ Setup complete!\n');

    } catch (error) {
        console.error(`\n✗ Error: ${error.message}\n`);
        process.exit(1);
    } finally {
        rl.close();
    }
}

setup();
