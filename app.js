document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const labelInput = document.getElementById('label');
    const messageInput = document.getElementById('message');
    const colorInput = document.getElementById('color');
    const labelColorInput = document.getElementById('labelColor');
    const styleSelect = document.getElementById('style');
    const logoInput = document.getElementById('logo');
    const logoColorInput = document.getElementById('logoColor');
    
    // Preview and output elements
    const badgePreview = document.getElementById('badgePreview');
    const markdownSnippet = document.getElementById('markdownSnippet');
    const copyBtn = document.getElementById('copyBtn');
    const copyFeedback = document.getElementById('copyFeedback');

    // Utility to encode URL properly replacing dashes with double dashes for shields.io format
    // Format: <LABEL>-<MESSAGE>-<COLOR>
    const encodeBadgeText = (text) => {
        if (!text) return '';
        return encodeURIComponent(text.replace(/-/g, '--').replace(/_/g, '__').replace(/ /g, '_'));
    };

    const updateBadge = () => {
        // Build the left side of URL: label-message-color
        let label = labelInput.value.trim();
        let message = messageInput.value.trim() || 'preview';
        let color = colorInput.value.trim() || 'blue';
        
        let pathParts = [];
        
        if (label) {
            pathParts.push(encodeBadgeText(label));
        }
        pathParts.push(encodeBadgeText(message));
        pathParts.push(encodeBadgeText(color));
        
        let badgePath = pathParts.join('-');
        
        // Base URL
        let url = new URL(`https://img.shields.io/badge/${badgePath}`);
        
        // Query parameters
        const style = styleSelect.value;
        const labelColor = labelColorInput.value.trim();
        const logo = logoInput.value.trim();
        const logoColor = logoColorInput.value.trim();
        
        if (style && style !== 'flat') {
            url.searchParams.append('style', style);
        }
        if (labelColor) {
            url.searchParams.append('labelColor', labelColor.replace(/^#/, ''));
        }
        if (logo) {
            url.searchParams.append('logo', logo);
        }
        if (logoColor) {
            url.searchParams.append('logoColor', logoColor.replace(/^#/, ''));
        }

        const finalUrl = url.toString();
        
        // Update image
        badgePreview.src = finalUrl;
        
        // Update Markdown
        const altText = label ? `${label} ${message}` : message;
        markdownSnippet.value = `![${altText}](${finalUrl})`;
    };

    // Add event listeners to all inputs
    const inputs = [labelInput, messageInput, colorInput, labelColorInput, styleSelect, logoInput, logoColorInput];
    inputs.forEach(input => {
        input.addEventListener('input', updateBadge);
    });

    // Copy to clipboard functionality
    copyBtn.addEventListener('click', () => {
        markdownSnippet.select();
        markdownSnippet.setSelectionRange(0, 99999); // For mobile devices
        
        navigator.clipboard.writeText(markdownSnippet.value).then(() => {
            copyFeedback.classList.add('show');
            setTimeout(() => {
                copyFeedback.classList.remove('show');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    });

    // Setup color pickers sync
    const setupColorSync = (textInput, pickerInput) => {
        textInput.addEventListener('input', (e) => {
            let val = e.target.value.trim();
            if (val.startsWith('#') && (val.length === 4 || val.length === 7)) {
                if (val.length === 4) {
                    val = '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3];
                }
                pickerInput.value = val;
            }
        });

        pickerInput.addEventListener('input', (e) => {
            textInput.value = e.target.value;
            updateBadge();
        });
    };

    setupColorSync(colorInput, document.getElementById('colorPicker'));
    setupColorSync(labelColorInput, document.getElementById('labelColorPicker'));
    setupColorSync(logoColorInput, document.getElementById('logoColorPicker'));

    // Initialize the preview
    updateBadge();
});
