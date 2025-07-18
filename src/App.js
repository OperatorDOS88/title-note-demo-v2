import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const result = generateTitleNote(input);
    setOutput(result);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Title Note Generator</h1>
      <textarea
        rows={10}
        className="w-full p-2 border border-gray-300 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste field notes here..."
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleGenerate}
      >
        Generate Title Note
      </button>
      {output && (
        <div className="mt-6 bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}

function generateTitleNote(input) {
  // Hardcoded output based on Word Doc example
  if (input.toLowerCase().includes("raymond gunn")) {
    return `
Raymond Gunn was referenced in a Final Decree recorded in Book 382, Page 894, dated March 7, 1998. Probate records list a term mineral interest that is now expired. The interest was received by Mineral Deed recorded in Book 45, Page 234, dated March 7, 1988, with a 5-year term. No production has occurred in the subject area.

For the purposes of this report, the examiner has not credited any interest due to expiration of term interest.
    `;
  }

  if (input.toLowerCase().includes("ryan guilin")) {
    return `
Ryan Guilin conveyed an undivided 1/2 mineral interest to Alec Priest by Mineral Deed recorded in Book 45, Page 98, dated April 6, 1998. However, field records indicate Ryan did not own an undivided 1/2 interest at the time of conveyance, creating a potential over-conveyance issue affecting Tract 5.

For the purposes of this report, the examiner has credited the interest based on record instruments, subject to curative review.
    `;
  }

  return "No matching input.";
}

export default App;
