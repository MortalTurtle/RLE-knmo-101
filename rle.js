let args = process.argv
let commandType = args[2];
let inputFile = args[3];
let outputFile = args[4];

if (commandType == 'code')
    CompressToFileFromFile(inputFile,outputFile);
else if (commandType == 'decode')
    DecompressToFileFromFile(inputFile,outputFile);




function CompressToFileFromFile(inputFile, outputFile)
{
    let fs = require('fs')
    fs.readFile(inputFile,(err, data) => 
    {
        let textToEncode = data.toString();
        fs.writeFileSync(outputFile,
                        CompressStr(textToEncode),
                        (err) => 
        { 
            if (err) console.err();
        })
    })
}

function DecompressToFileFromFile(inputFile, outputFile)
{
    let fs = require('fs');
    fs.readFile(inputFile, (err, data) =>
    {
        let dataToDecode = data.toString();
        fs.writeFile(outputFile,
            DecompressStr(dataToDecode),
            (err) => {if (err) console.err});
    })
}

function CompressStr(textToEncode)
{
    let compressed = '';
    for (let i = 0; i < textToEncode.length;)
    {
        let n = 1;
        while(textToEncode.charAt(i) == textToEncode.charAt(i + n))
            n++;
        let moveTo = n + i;
        if (n > 3 || textToEncode.charAt(i) == '#')
        {
            while(n > 0)
            {
                compressed += '#' + String.fromCharCode(Math.min(255,n))
                                  + textToEncode.charAt(i);
                n -= 255;
            }
        }
        else compressed += textToEncode.charAt(i).repeat(n);
        i = moveTo;
    }
    return compressed;
}

function DecompressStr(dataToDecode)
{
    var decompressed = '';
    for (let i = 0; i < dataToDecode.length;)
    {
        if (dataToDecode.charAt(i) != '#')
        {
            decompressed += dataToDecode.charAt(i);
            i++;
            continue;
        }
        decompressed += dataToDecode[i + 2].repeat(dataToDecode.charCodeAt(i + 1))
        i += 3;
    }
    return decompressed;
}