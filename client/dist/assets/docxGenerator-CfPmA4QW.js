import{J as u,r as h,p as w}from"./index-3-fk1Zzw.js";typeof window<"u"&&"Worker"in window&&!w.GlobalWorkerOptions.workerSrc&&(w.GlobalWorkerOptions.workerSrc=`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${w.version||"3.11.174"}/pdf.worker.min.js`);function y(n){return n?n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;"):""}async function T(n,s=()=>{}){s(20,"Reading PDF structure...");const i=await h(n),d=await w.getDocument({data:i}).promise,p=d.numPages,f=[];for(let t=1;t<=p;t++){s(20+Math.round(t/p*50),`Extracting text from page ${t} of ${p}...`);const g=await(await d.getPage(t)).getTextContent(),l=[];let e="",o=null;for(const a of g.items){const m=a.transform[5];o!==null&&Math.abs(m-o)>5?(e.trim()&&l.push(e.trim()),e=a.str):e+=(e?" ":"")+a.str,o=m}e.trim()&&l.push(e.trim()),f.push({pageNumber:t,lines:l.length>0?l:["[Page "+t+" Content]"]})}return f}async function b(n,s=()=>{}){const i=await T(n,s);s(75,"Constructing genuine Word (.docx) document...");const r=new u;r.file("[Content_Types].xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`),r.folder("_rels").file(".rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`),r.folder("word").folder("_rels").file("document.xml.rels",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`),r.folder("word").file("styles.xml",`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
        <w:sz w:val="22"/>
        <w:szCs w:val="22"/>
        <w:color w:val="222222"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="160" w:line="240" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
</w:styles>`);let c="";for(let o=0;o<i.length;o++){const a=i[o];o>0&&(c+='<w:p><w:r><w:br w:type="page"/></w:r></w:p>');for(const m of a.lines){const x=y(m);c+=`<w:p><w:r><w:t xml:space="preserve">${x}</w:t></w:r></w:p>`}}const g=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${c}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;r.folder("word").file("document.xml",g),s(90,"Packaging Word (.docx) package...");const l=await r.generateAsync({type:"blob",mimeType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",compression:"DEFLATE",compressionOptions:{level:6}});s(100,"Word conversion complete!");const e=n.name.replace(/\.[^/.]+$/,"")+".docx";return{blob:l,filename:e}}export{b as createValidDocxFromPdf,T as extractPdfText};
