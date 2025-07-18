import { useState } from "react"
import { Textarea } from "./components/ui/textarea"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleGenerate = () => {
    const result = generateTitleNote(input);
    setOutput(result);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-4">
          <h1 className="text-lg font-bold mb-4">Title Note Generator</h1>
          <Textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your field note or summary here..."
          />
          <Button className="mt-4" onClick={handleGenerate}>
            Generate Title Note
          </Button>
          <div className="mt-6 whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
            {output}
          </div>
        </CardContent>
      </Card>
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

  let hasFD = false;
  let hasExpired = false;
  let hasProduction = false;
  let subject = "";

  lines.forEach(line => {
    const deedMatch = line.match(/\b(QCD|MD|AOGL|DTO|DOTO|WD|GWD|QCMD|FD)\b/);
    const bkpgMatch = line.match(/(\d{1,4})[-\/](\d{1,4})/);
    const dateMatch = line.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/);
    const termMatch = line.toLowerCase().includes('term');
    const prodMatch = line.toLowerCase().includes('no production');
    const expiredMatch = line.toLowerCase().includes('expired');
    const nameMatch = line.match(/([A-Z][a-z]+ [A-Z][a-z]+)/); // pulls subject name (e.g., Raymond Gunn)

    if (nameMatch && !subject) subject = nameMatch[1];

    if (deedMatch && deedMatch[1] === "FD" && bkpgMatch && dateMatch) {
      hasFD = true;
      const [_, book, page] = bkpgMatch;
      const formattedDate = formatDate(dateMatch[1]);
      output += `A Final Decree was entered in Book ${book}, Page ${page}, dated ${formattedDate}. `;
    }

    if (termMatch && expiredMatch) hasExpired = true;
    if (prodMatch) hasProduction = true;
  });

  if (hasFD && hasExpired) {
    output += `Probate records reference the same interest. `;
    output += `The interest was term-limited beginning on March 7, 1988, and is believed to have expired. `;
  }

  if (hasProduction) {
    output += `No production has occurred in the subject area. `;
  }

  output += `\n\nFor the purposes of this report, the examiner has `;
  output += hasExpired
    ? `not credited any interest due to expiration of term interest.`
    : `credited the interest based on record instruments.`;

  return output.trim();
}

export default App;
