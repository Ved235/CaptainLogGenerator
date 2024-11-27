const generatePirateLog = async (userInput) => {
  const apiKey = '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'; 

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `The users will send messages regarding their daily activity or journaling for that day. Convert the text into a pirate captain’s log entry. Use nautical language, pirate jargon, and make it sound adventurous and exaggerated. Be sure to use pirate expressions like 'Arrr!', 'Ahoy, matey!', and 'Avast!'.`
        },
        {
          role: "user",
          content: userInput 
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.8,
      max_tokens: 1500,
      top_p: 1,
      stop: null,
      stream: false
    })
  });

  const data = await response.json();

  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content;
  } else {
    return "Arrr, something went wrong, matey!";
  }
};

document.getElementById('generateLogButton').addEventListener('click', async () => {
  const userActivity = document.getElementById('userActivity').value; 
  const pirateLog = await generatePirateLog(userActivity); 
  document.getElementById('captainsLog').innerText = pirateLog; 
});
