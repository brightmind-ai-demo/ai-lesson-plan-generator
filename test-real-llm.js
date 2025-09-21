// Test script to actually make a real LLM call
async function testRealLLMCall() {
    console.log('Testing REAL LLM API call...');
    
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: 'Create a lesson plan for 9th grade World War II history class',
                parameters: {
                    max_length: 100,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ REAL LLM RESPONSE:', result);
            return result;
        } else {
            console.log('❌ API Error:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('Error details:', errorText);
            return null;
        }
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        return null;
    }
}

// Test the call
testRealLLMCall().then(result => {
    if (result) {
        console.log('🎉 SUCCESS: Real LLM call worked!');
        console.log('Generated content:', result);
    } else {
        console.log('💥 FAILED: LLM call failed, would fall back to algorithms');
    }
});
