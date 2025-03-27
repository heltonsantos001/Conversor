document.getElementById('fileInput').addEventListener('change', previewImage);  // Pré-visualização ao selecionar o arquivo

document.getElementById('convertButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const outputFormat = document.getElementById('outputFormat').value;
    const status = document.getElementById('status');
    const convertedImage = document.getElementById('convertedImage');
    const downloadButton = document.getElementById('downloadButton');
    const imageIcon = document.getElementById('imageIcon');

    if (fileInput.files.length === 0) {
        status.textContent = 'Por favor, selecione uma imagem!';
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;

        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const convertedDataURL = canvas.toDataURL(`image/${outputFormat}`, 1.0);

            // Exibe a imagem convertida
            convertedImage.src = convertedDataURL;
            convertedImage.style.display = 'block';

            // Atualiza o link de download
            downloadButton.href = convertedDataURL;
            downloadButton.download = `imagem-convertida.${outputFormat}`;
            downloadButton.style.display = 'inline-block';

            // Remove o ícone e atualiza o status
            imageIcon.style.display = 'none';
            status.textContent = 'Conversão concluída!';
        };
    };

    reader.readAsDataURL(file);
});

// Função para pré-visualizar a imagem antes da conversão
function previewImage() {
    const fileInput = document.getElementById("fileInput");
    const imagePreview = document.getElementById("convertedImage");  // Usando o mesmo <img> para pré-visualização

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;  // Define a imagem como pré-visualização
            imagePreview.style.display = "block";  // Mostra a imagem
            document.getElementById('imageIcon').style.display = 'none';  // Oculta o ícone quando a imagem aparece
        };
        reader.readAsDataURL(file);
    }
}
