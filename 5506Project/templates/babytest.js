const tracker = new clm.tracker();
tracker.init();


document.getElementById('uploadedImages').addEventListener('click', () => {
    document.getElementById('imageUploads').click();
});

// 加载模型和设置事件处理器
async function initialize() {
    // 处理上传的图像
    document.getElementById('imageUploads').addEventListener('change', async (event) => {
        const file = event.target.files[0];
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            // 设置画布尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // 开始跟踪面部特征
            tracker.start(canvas);

            const positions = tracker.getCurrentPosition();
            
            // 检查眼睛状态
            if (positions.length > 0) {
                const leftEye = [positions[36], positions[37], positions[38]]; // 左眼标记点
                const rightEye = [positions[42], positions[43], positions[44]]; // 右眼标记点

                const leftEyeOpen = isEyeOpen(leftEye);
                const rightEyeOpen = isEyeOpen(rightEye);

                const status = 'baby is on bed.' ;
                document.getElementById('on_bed').innerText = status;
            } else {
                document.getElementById('on_bed').innerText = 'baby is not at bed.';
            }
        };
    });
}

// 判断眼睛是否睁开
function isEyeOpen(eyeLandmarks) {
    const verticalDistance = Math.abs(eyeLandmarks[0][1] - eyeLandmarks[2][1]); // 眼睛上下的高度
    const horizontalDistance = Math.abs(eyeLandmarks[0][0] - eyeLandmarks[1][0]); // 眼睛左右的宽度
    return verticalDistance < horizontalDistance * 0.01; // 比较高度与宽度的比例，设定阈值
}

// 初始化
initialize();