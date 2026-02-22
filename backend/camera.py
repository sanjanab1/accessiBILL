import cv2
import pytesseract

# If needed (Mac usually auto-detects, but include if error)
# pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"

def process_image(image):
    # Improve OCR accuracy
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    text = pytesseract.image_to_string(gray)

    if text.strip():
        return text
    else:
        return "No text detected."

# Start camera
cap = cv2.VideoCapture(0)
print("Press 's' to take a snapshot, 'u' to upload an image, 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("Live Camera", frame)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        break

    elif key == ord('s'):  # snapshot
        print("\n--- Snapshot Taken ---")
        text = process_image(frame)
        print("Detected Text:\n")
        print(text)

    elif key == ord('u'):  # upload image
        filename = input("Enter full path to image: ")
        try:
            img = cv2.imread(filename)
            if img is None:
                print("File not found or not an image.")
            else:
                text = process_image(img)
                print("\n--- Uploaded Image ---")
                print("Detected Text:\n")
                print(text)
        except Exception as e:
            print("Error opening file:", e)

cap.release()
cv2.destroyAllWindows()