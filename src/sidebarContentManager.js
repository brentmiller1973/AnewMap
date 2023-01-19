const sidebarContentManager = (data) => {
    const domElm = document.querySelector('#sidebar .sidebar-content-data');
    domElm.innerHTML = `
        <div>
            <h1>${data.Project}</h1>
            
            <ul style="margin-left: 0;padding-left: 12px;margin-top: 2rem;">
                <li><strong>ProjType:</strong> ${data.ProjType}</li>          
                <li><strong>Ownership:</strong> ${data.Ownership}</li>
                <li><strong>Region:</strong> ${data.Region}</li>
                <li><strong>Acres:</strong> ${data.Acres}</li>            
            </ul>
         </div> 
    `;
};


export default sidebarContentManager;
