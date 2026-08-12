from PIL import Image
import io


def file_to_gemini_parts(file_bytes: bytes, filename: str) -> list:
    """
    Converts an uploaded prescription/report file into image parts Gemini's
    vision model can read directly.
    - Image (jpg/png): loaded directly and converted to RGB mode.
    - PDF: each page converted to an image.
    """
    lower = filename.lower()

    if lower.endswith(".pdf"):
        from pdf2image import convert_from_bytes
        pages = convert_from_bytes(file_bytes)
        rgb_pages = []
        for p in pages:
            if p.mode != "RGB":
                p = p.convert("RGB")
            p.thumbnail((1500, 1500))
            rgb_pages.append(p)
        return rgb_pages

    image = Image.open(io.BytesIO(file_bytes))
    if image.mode != "RGB":
        image = image.convert("RGB")
    image.thumbnail((1500, 1500))
    return [image]

