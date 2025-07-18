import { useState } from "react";

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
  let instruments = [];
  let owner = "";
  let termStartDate = null;
  let termExpired = false;
  let noProduction = false;

  const lines = input.trim().split('\n');

  lines.forEach(line => {
    const ownerMatch = line.match(/([A-Z][a-z]+\s[A-Z][a-z]+|[A-Z][a-z]+), deceased/);
    if (ownerMatch && !owner) {
      owner = ownerMatch[1];
    }

    const deedMatch = line.match(/(QCD|MD|AOGL|DTO|DOTO|WD|GWD|QCMD|FD)/);
    const bkpgMatch = line.match(/(\d{1,4})\s*[-\/\s]?\s*(\d{1,4})/);
    const dateMatch = line.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/);

    if (deedMatch && bkpgMatch) {
      const deed = deedMap[deedMatch[1]] || "Instrument";
      const [_, book, page] = bkpgMatch;
      const date = dateMatch ? formatDate(dateMatch[1]) : "an unknown date";
      instruments.push({ deed, book, page, date, raw: line });
    }

    if (line.toLowerCase().includes("term") && dateMatch) {
      termStartDate = formatDate(dateMatch[1]);
    }

    if (line.toLowerCase().includes("expired")) termExpired = true;
    if (line.toLowerCase().includes("no production")) noProduction = true;
  });

  if (owner) {
    output += `${owner} received `;
  }

  instruments.forEach((inst, idx) => {
    if (idx === 0 && owner) {
      output += `an interest by ${inst.deed} recorded in Book ${inst.book}, Page ${inst.page}, dated ${inst.date}. `;
    } else {
      output += `${inst.deed} recorded in Book ${inst.book}, Page ${inst.page}, dated ${inst.date}, `;
      output += inst.deed === "Final Decree" ? "was entered as a Final Decree. " : "was used to convey interest. ";
    }
  });

  if (termStartDate) {
    output += `The interest was term-limited beginning on ${termStartDate}`;
    output += termExpired ? `, and is believed to have expired. ` : `. `;
  }

  if (noProduction) {
    output += `No production has occurred in the subject area. `;
  }

  output += "\n\nFor the purposes of this report, the examiner has ";
  output += termExpired
    ? "not credited any interest due to expiration of term interest."
    : "credited the interest based on record instruments.";

  return output.trim();
}

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const result = generateTitleNote(input);
    setOutput(result);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">Title Note Generator</h1>
      <textarea
        rows={10}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste unstructured field notes here (e.g. 'MD 159-29 on 5/1/67 from Redfords...')"
        className="w-full border rounded p-2 text-sm"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Generate Title Note
      </button>
      <div className="whitespace-pre-wrap bg-gray-100 text-sm p-4 rounded border">
        {output}
      </div>
    </div>
  );
}

export default App;
