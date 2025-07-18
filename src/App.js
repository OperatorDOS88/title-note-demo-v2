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
  const deedMap = {
    QCD: "Quit Claim Deed",
    MD: "Mineral Deed",
    AOGL: "Assignment of Oil and Gas Leases",
    DTO: "Drilling Title Opinion",
    DOTO: "Division Order Title Opinion",
    WD: "Warranty Deed",
    GWD: "General Warranty Deed",
    QCMD: "Quit Claim Mineral Deed",
    FD: "Final Decree"
  };

  function formatDate(dateStr) {
    const [month, day, year] = dateStr.split('/');
    const fullYear = year.length === 2 ? (parseInt(year) < 25 ? '20' + year : '19' + year) : year;
    const dateObj = new Date(`${fullYear}-${month}-${day}`);
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  let output = "";
  const lines = input.trim().split('\n');

  lines.forEach(line => {
    const deedMatch = line.match(/\b(QCD|MD|AOGL|DTO|DOTO|WD|GWD|QCMD|FD)\b/);
    const bkpgMatch = line.match(/\b(?:MD\s)?(\d{1,4})[\s\/\-](\d{1,4})\b/i);  // Fixed regex for MD + book/page
    const dateMatch = line.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/);
    const prodMatch = line.toLowerCase().includes('no production');
    const expiredMatch = line.toLowerCase().includes('expired');
    const overconvey = line.toLowerCase().includes('over-conveyance') || line.toLowerCase().includes('over conveyance');

    let formattedDate = dateMatch ? formatDate(dateMatch[1]) : "an unknown date";
    let book = bkpgMatch ? bkpgMatch[1] : null;
    let page = bkpgMatch ? bkpgMatch[2] : null;

    // Check if we're getting book/page correctly
    console.log(`Line: ${line}`);
    console.log(`Book: ${book}, Page: ${page}`);

    if (line.toLowerCase().includes("raymond gunn")) {
      output += `Raymond Gunn received an interest that was referenced in a Final Decree recorded in Book ${book}, Page ${page}, dated ${formattedDate}. `;
      if (expiredMatch) output += `The interest was term-limited and is believed to have expired. `;
      if (prodMatch) output += `No production has occurred in the subject area. `;
      output += `\n\nFor the purposes of this report, the examiner has not credited any interest due to expiration of term interest.`;
    }

    else if (line.toLowerCase().includes("ryan guilin")) {
      output += `Ryan Guilin conveyed an undivided 1/2 mineral interest to Alec Priest by Mineral Deed recorded in Book ${book}, Page ${page}, dated ${formattedDate}. `;
      if (overconvey) output += `However, field records indicate Ryan did not own an undivided 1/2 interest at the time of conveyance, creating a potential over-conveyance issue affecting Tract 5. `;
      output += `\n\nFor the purposes of this report, the examiner has credited the interest based on record instruments, subject to curative review.`;
    }
  });

  return output.trim();
}

export default App;
