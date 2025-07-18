import { useState } from "react";

function formatDate(dateStr) {
  const [month, day, year] = dateStr.split('/');
  const fullYear = year.length === 2 ? (parseInt(year) < 25 ? '20' + year : '19' + year) : year;
  const dateObj = new Date(`${fullYear}-${month}-${day}`);
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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

  let output = "";
  const lines = input.trim().split('\n');

  lines.forEach(line => {
    const deedMatch = line.match(/(QCD|MD|AOGL|DTO|DOTO|WD|GWD|QCMD|FD)/);
    const bkpgMatch = line.match(/(\d{1,4})[\/\s-](\d{1,4})/);
    const dateMatch = line.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/);
    const tractMatch = line.match(/Tract\s*(\d+)/i);
    const termMatch = line.toLowerCase().includes('term');
    const prodMatch = line.toLowerCase().includes('no production');
    const expiredMatch = line.toLowerCase().includes('expired');
    const overConvMatch = line.toLowerCase().includes('over-conveyance');

    const formattedDate = dateMatch ? formatDate(dateMatch[1]) : "an unknown date";

    if (deedMatch && bkpgMatch) {
      const [_, book, page] = bkpgMatch;
      const deedFull = deedMap[deedMatch[1]] || "Instrument";

      if (deedMatch[1] === "FD") {
        output += `${deedFull} was entered in Book ${book}, Page ${page}, dated ${formattedDate}. `;
        output += `Probate records reference the same interest. `;
      } else {
        output += `${deedFull} recorded in Book ${book}, Page ${page}, dated ${formattedDate}, was used to convey interest. `;
      }
    }

    if (termMatch && expiredMatch) {
      output += `The interest was term-limited and is believed to have expired. `;
    }

    if (prodMatch) {
      output += `No production has occurred in the subject area. `;
    }

    if (overConvMatch) {
      output += `There appears to be a potential over-conveyance due to lack of full ownership. `;
    }
  });

  output += "\n\nFor the purposes of this report, the examiner has ";
  if (output.toLowerCase().includes("expired")) {
    output += "not credited any interest due to expiration of term interest.";
  } else {
    output += "credited the interest based on record instruments.";
  }

  return output.trim();
}

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const result = generateTitleNote(input);
    setOutput(result);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Title Note Generator</h1>

      <textarea
        rows={8}
        className="w-full p-3 border border-gray-300 rounded text-sm"
        placeholder="Paste raw field notes here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleGenerate}
      >
        Generate Title Note
      </button>

      {output && (
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded text-sm whitespace-pre-wrap">
          {output}
        </div>
      )}
    </div>
  );
}
