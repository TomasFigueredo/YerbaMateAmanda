const slug = window.location.pathname 
    .replace('/', '').replace('.html', '') || 'home'; 

const richTextToHtml = (blocks) => { 
    if (!Array.isArray(blocks)) return ''; 

    const renderChildren = (children) => 
    children.map(child => { 
        if (child.type === 'text') { 
        let t = child.text 
            .replace(/&/g, '&amp;') 
            .replace(/</g, '&lt;') 
            .replace(/>/g, '&gt;'); 
        if (child.bold)      t = `<strong>${t}</strong>`; 
        if (child.italic)    t = `<em>${t}</em>`; 
        if (child.underline) t = `<u>${t}</u>`; 
        if (child.code)      t = `<code>${t}</code>`; 
        return t; 
        } 
        if (child.type === 'link') { 
        return `<a href='${child.url}' target='_blank' rel='noopener'> 
            ${renderChildren(child.children)}</a>`; 
        } 
        return ''; 
    }).join(''); 
    
    return blocks.map(block => { 
    const inner = renderChildren(block.children || []); 
    switch (block.type) { 
        case 'paragraph': return `<p>${inner}</p>`; 
        case 'heading':   return `<h${block.level}>${inner}</h${block.level}>`; 
        case 'quote':     return `<blockquote>${inner}</blockquote>`; 
        case 'code':      return `<pre><code>${inner}</code></pre>`; 
        case 'list': { 
        const tag   = block.format === 'ordered' ? 'ol' : 'ul'; 
        const items = (block.children || []) 
            .map(li => `<li>${renderChildren(li.children || [])}</li>`) 
            .join(''); 
        return `<${tag}>${items}</${tag}>`; 
        } 
        case 'image': 
        return `<img src='${block.image?.url || ''}' 
alt='${block.image?.alternativeText || ''}'>`; 
        default: return `<p>${inner}</p>`; 
    } 
    }).join('\n'); 
}; 

/*13. Variables de entorno*/

const cargarContenido = async () => { 
    try { 
        const res = await fetch(`/api/content/${slug}`); 
        if (!res.ok) throw new Error('No encontrado'); 
        const pagina = await res.json(); 
            
        document.getElementById('titulo').textContent    = pagina.Titulo || ''; 
        document.getElementById('subtitulo').textContent = pagina.SubTitulo || ''; 
        document.getElementById('pageTitle').textContent = pagina.Titulo || 'Sitio'; 
            
        const metaDesc = document.getElementById('metaDesc'); 
        if (metaDesc) metaDesc.content = pagina.meta_descripcion || ''; 
            
        // Rich Text (ver sección 12) 
        const cuerpoEl = document.getElementById('cuerpo'); 
        if (cuerpoEl && pagina.Cuerpo) { 
            cuerpoEl.innerHTML = richTextToHtml(pagina.Cuerpo); 
    } 
    } catch (err) { 
        document.getElementById('titulo').textContent = 'Página no disponible'; 
        console.error('Error cargando contenido:', err); 
    } 
}; 

cargarContenido();

