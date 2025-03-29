document.getElementById('fileInput').addEventListener('change', (event) => {
    const fileInput = event.target;
    const convertedImages = document.getElementById('convertedImages');
    const status = document.getElementById('status');

    if (fileInput.files.length === 0) {
        status.textContent = 'Por favor, selecione ao menos uma imagem!';
        return;
    }

    convertedImages.innerHTML = '';  

    Array.from(fileInput.files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                const width = img.width;
                const height = img.height;
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');

                const convertedImage = document.createElement('img');
                convertedImage.src = e.target.result;
                convertedImage.alt = 'Imagem para converter';
                imageContainer.appendChild(convertedImage);

                const outputFormatInput = document.createElement('select');
                outputFormatInput.id = 'outputFormatInput';
                const formats = ['webp', 'png', 'jpeg'];
                formats.forEach(format => {
                    const option = document.createElement('option');
                    option.value = format;
                    option.textContent = format.toUpperCase();
                    outputFormatInput.appendChild(option);
                });
                imageContainer.appendChild(outputFormatInput);

                const convertButton = document.createElement('button');
                convertButton.textContent = 'Converter';
                convertButton.addEventListener('click', () => {
                    const selectedFormat = outputFormatInput.value;

                  
                    convertButton.disabled = true;
                    outputFormatInput.disabled = true; 
                    convertButton.innerHTML = `<span class="spinner"></span>`;

                    canvas.toBlob((blob) => {
                        const optimizedImageURL = URL.createObjectURL(blob);

                        const downloadButton = document.createElement('a');
                        downloadButton.href = optimizedImageURL;
                        downloadButton.download = file.name.split('.')[0] + '.' + selectedFormat;
                        downloadButton.textContent = 'Baixar';
                        imageContainer.appendChild(downloadButton);

                       
                        convertButton.remove();
                    }, `image/${selectedFormat}`, 0.88);
                });
                imageContainer.appendChild(convertButton);
                convertedImages.appendChild(imageContainer);
            };
        };
        reader.readAsDataURL(file);
    });
});
