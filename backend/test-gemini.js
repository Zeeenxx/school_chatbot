const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log('❌ No API key found in .env file');
    return;
  }
  
  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with the new model name
    console.log('🧪 Testing gemini-1.5-flash model...');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Say hello in a friendly way for a school chatbot test.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Gemini AI is working!');
    console.log('🤖 Response:', text);
    
  } catch (error) {
    console.log('❌ Error testing Gemini API:');
    console.log('Error details:', error.message);
    
    if (error.message.includes('API key not valid')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check if your API key is correct');
      console.log('2. Make sure you created the key at: https://makersuite.google.com/app/apikey');
      console.log('3. Verify the API key has permissions for Generative AI');
    } else if (error.message.includes('not found')) {
      console.log('\n🔧 Model not found. Let me try different models...');
      
      // Try alternative models
      const modelsToTry = ['gemini-1.5-pro', 'gemini-1.0-pro'];
      
      for (const modelName of modelsToTry) {
        try {
          console.log(`🧪 Trying ${modelName}...`);
          const testModel = genAI.getGenerativeModel({ model: modelName });
          const testResult = await testModel.generateContent("Test");
          console.log(`✅ ${modelName} works!`);
          break;
        } catch (modelError) {
          console.log(`❌ ${modelName} failed: ${modelError.message}`);
        }
      }
    }
  }
}

console.log('🚀 Testing Gemini API integration...\n');
testGeminiAPI();
