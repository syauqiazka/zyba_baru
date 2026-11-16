import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def draw_vector_leaf(draw, cx, cy, size=24, color=(62, 123, 84)):
    # Simple elegant leaf shape
    r = size // 2
    draw.polygon([
        (cx, cy - r),
        (cx + r, cy),
        (cx, cy + r),
        (cx - r, cy)
    ], fill=color)
    # Leaf vein
    draw.line([(cx, cy - r + 4), (cx, cy + r - 4)], fill=(255, 255, 255), width=2)

def draw_vector_breeze(draw, cx, cy, size=24, color=(224, 122, 95)):
    # 3 flowing soft air stream lines
    r = size // 2
    draw.line([(cx - r, cy - 6), (cx + r - 4, cy - 6)], fill=color, width=3)
    draw.arc([(cx + r - 8, cy - 10), (cx + r, cy - 2)], start=270, end=90, fill=color, width=3)
    draw.line([(cx - r + 4, cy), (cx + r - 2, cy)], fill=color, width=3)
    draw.line([(cx - r, cy + 6), (cx + r - 6, cy + 6)], fill=color, width=3)

def create_zyba_mobile_ui():
    w, h = 780, 1688
    ui = Image.new('RGBA', (w, h), (247, 249, 247, 255)) # Soft sanctuary background #F7F9F7
    draw = ImageDraw.Draw(ui)

    # Fonts
    font_path_bold = 'C:/Windows/Fonts/segoeuib.ttf'
    font_path_reg = 'C:/Windows/Fonts/segoeui.ttf'
    font_path_semi = 'C:/Windows/Fonts/segoeuisl.ttf' if os.path.exists('C:/Windows/Fonts/segoeuisl.ttf') else font_path_reg

    f_title = ImageFont.truetype(font_path_bold, 34)
    f_card_title = ImageFont.truetype(font_path_bold, 28)
    f_card_sub = ImageFont.truetype(font_path_reg, 18)
    f_body = ImageFont.truetype(font_path_reg, 20)
    f_body_bold = ImageFont.truetype(font_path_bold, 20)
    f_small = ImageFont.truetype(font_path_reg, 16)
    f_small_bold = ImageFont.truetype(font_path_bold, 16)
    f_tiny = ImageFont.truetype(font_path_bold, 13)
    f_stat_num = ImageFont.truetype(font_path_bold, 30)
    f_btn = ImageFont.truetype(font_path_bold, 22)

    # 1. Status Bar
    draw.text((56, 32), "09:41", fill=(27, 36, 30), font=ImageFont.truetype(font_path_bold, 24))
    # Battery icon (X: 670, Y: 36)
    draw.rounded_rectangle([(670, 36), (714, 56)], radius=4, outline=(27, 36, 30), width=2)
    draw.rounded_rectangle([(714, 42), (718, 50)], radius=2, fill=(27, 36, 30))
    draw.rounded_rectangle([(673, 39), (708, 53)], radius=3, fill=(62, 123, 84)) # Full battery in green
    # Wifi icon
    draw.arc([(626, 30), (654, 58)], start=210, end=330, fill=(27, 36, 30), width=3)
    draw.arc([(632, 36), (648, 52)], start=210, end=330, fill=(27, 36, 30), width=3)
    draw.ellipse([(638, 48), (642, 52)], fill=(27, 36, 30))
    # Cellular bars
    for i, bar_h in enumerate([6, 11, 16, 21]):
        draw.rounded_rectangle([(585 + i*8, 56 - bar_h), (590 + i*8, 56)], radius=2, fill=(27, 36, 30))

    # 2. Top Header Bar (Y: 85 to 160)
    # Brand logo badge
    draw.rounded_rectangle([(48, 90), (96, 138)], radius=14, fill=(62, 123, 84))
    draw.text((62, 98), "Z", fill=(255, 255, 255), font=ImageFont.truetype(font_path_bold, 28))
    draw.text((110, 94), "ZYBA", fill=(27, 36, 30), font=ImageFont.truetype(font_path_bold, 24))
    draw.text((110, 122), "Suaka Kesejahteraan", fill=(100, 116, 107), font=f_small)

    # Avatar right
    draw.ellipse([(676, 90), (724, 138)], fill=(225, 238, 230), outline=(62, 123, 84, 80), width=2)
    draw.text((692, 98), "S", fill=(62, 123, 84), font=ImageFont.truetype(font_path_bold, 24))

    # 3. Mascot Greeting Card (Y: 170 to 370)
    card_bg = (235, 243, 237)
    card_border = (200, 220, 205)
    draw.rounded_rectangle([(44, 170), (736, 370)], radius=28, fill=card_bg, outline=card_border, width=2)

    # Tag badge
    draw.rounded_rectangle([(68, 192), (230, 224)], radius=16, fill=(215, 234, 220))
    draw.text((82, 198), "HARI KE-7 • TERJAGA", fill=(40, 88, 59), font=f_tiny)

    draw.text((68, 240), "Halo, Teman ZYBA", fill=(27, 36, 30), font=f_card_title)
    draw.text((68, 280), "Bagaimana perasaanmu hari ini?", fill=(90, 107, 96), font=f_card_sub)
    draw.text((68, 316), "Pikiran tenang, jiwa lebih damai.", fill=(62, 123, 84), font=f_small_bold)

    # Paste real Mascot Zibi in greeting card
    mascot_path = 'public/mascot/uniform/senang.png'
    if os.path.exists(mascot_path):
        mascot = Image.open(mascot_path).convert('RGBA')
        mascot = mascot.resize((160, 160), Image.LANCZOS)
        ui.alpha_composite(mascot, (556, 195))

    # 4. Metrics Row (Y: 390 to 505) - 3 cards
    metrics = [
        ("Skor ZYBA", "88", "Harmonis", (62, 123, 84)),
        ("Lilin Jiwa", "7 Hari", "Konsisten", (224, 122, 95)),
        ("Tidur Sehat", "8.2 Jam", "Nyenyak", (46, 107, 128))
    ]
    card_w = 216
    gap = 16
    start_x = 44
    for i, (title, val, label, color) in enumerate(metrics):
        cx = start_x + i * (card_w + gap)
        draw.rounded_rectangle([(cx, 390), (cx + card_w, 505)], radius=22, fill=(255, 255, 255), outline=(225, 233, 227), width=2)
        # Small color dot
        draw.ellipse([(cx + 18, 408), (cx + 26, 416)], fill=color)
        draw.text((cx + 34, 404), title, fill=(100, 116, 107), font=f_small)
        draw.text((cx + 18, 432), val, fill=color, font=f_stat_num)
        draw.text((cx + 18, 474), label, fill=(120, 135, 126), font=f_tiny)

    # 5. Signature Botanical Voice & Companion Hero Card (Y: 525 to 1180)
    botanical_bg = (24, 46, 32) # #182E20
    draw.rounded_rectangle([(44, 525), (736, 1180)], radius=36, fill=botanical_bg, outline=(40, 70, 50), width=2)

    # Top pill inside card: "DIDUKUNG RANTAI AI BEBAS BIAYA • SIAP 24/7"
    draw.rounded_rectangle([(72, 555), (370, 589)], radius=17, fill=(35, 66, 48))
    draw.text((88, 563), "DIDUKUNG AI SUAKA", fill=(163, 230, 53), font=f_tiny)
    draw.rounded_rectangle([(580, 555), (708, 589)], radius=17, fill=(35, 66, 48))
    draw.text((600, 563), "SIAP 24/7", fill=(134, 239, 172), font=f_tiny)

    # Headline
    draw.text((72, 615), "Selamat datang di ruang tenangmu", fill=(134, 239, 172), font=f_small_bold)
    draw.text((72, 646), "Teman Zibi Siap Mendengarkan", fill=(255, 255, 255), font=f_title)

    # Large Circular Voice Orb in Center (X: 390, Y: 810)
    orb_cx, orb_cy = 390, 810
    # Outer ambient ripple
    draw.ellipse([(orb_cx - 110, orb_cy - 110), (orb_cx + 110, orb_cy + 110)], fill=(32, 60, 42), outline=(48, 88, 62), width=2)
    draw.ellipse([(orb_cx - 80, orb_cy - 80), (orb_cx + 80, orb_cy + 80)], fill=(44, 82, 57), outline=(62, 123, 84), width=2)
    # Core button
    draw.ellipse([(orb_cx - 54, orb_cy - 54), (orb_cx + 54, orb_cy + 54)], fill=(62, 123, 84))
    # Pause symbol inside button (white)
    draw.rounded_rectangle([(orb_cx - 16, orb_cy - 20), (orb_cx - 6, orb_cy + 20)], radius=4, fill=(255, 255, 255))
    draw.rounded_rectangle([(orb_cx + 6, orb_cy - 20), (orb_cx + 16, orb_cy + 20)], radius=4, fill=(255, 255, 255))

    # Soundwave bars below orb
    bars = [14, 24, 38, 55, 32, 48, 62, 45, 28, 40, 58, 48, 30, 52, 36, 22, 15]
    total_bars = len(bars)
    bar_w = 6
    bar_gap = 12
    wave_start_x = orb_cx - (total_bars * (bar_w + bar_gap)) // 2
    wave_y = 960
    for i, bh in enumerate(bars):
        bx = wave_start_x + i * (bar_w + bar_gap)
        draw.rounded_rectangle([(bx, wave_y - bh//2), (bx + bar_w, wave_y + bh//2)], radius=3, fill=(134, 239, 172))

    # Guidance text
    guide_text1 = "Curahkan isi hati lewat suara atau teks."
    guide_text2 = "100% privat, aman, dan tanpa penghakiman."
    tw1 = draw.textlength(guide_text1, font=f_card_sub)
    tw2 = draw.textlength(guide_text2, font=f_small)
    draw.text(((w - tw1)//2, 1010), guide_text1, fill=(220, 235, 225), font=f_card_sub)
    draw.text(((w - tw2)//2, 1040), guide_text2, fill=(160, 185, 170), font=f_small)

    # Terracotta CTA Button (matching Gambar 1)
    btn_y1, btn_y2 = 1085, 1150
    draw.rounded_rectangle([(72, btn_y1), (708, btn_y2)], radius=32, fill=(224, 122, 95)) # #E07A5F
    btn_text = "Coba Ruang Batin Sekarang  →"
    btw = draw.textlength(btn_text, font=f_btn)
    draw.text(((w - btw)//2, btn_y1 + 18), btn_text, fill=(255, 255, 255), font=f_btn)

    # 6. Features List (Y: 1205 to 1485)
    draw.text((50, 1210), "FITUR UNGGULAN TERBUKA:", fill=(100, 116, 107), font=f_small_bold)

    # Feature 1: Zyba Companion AI
    draw.rounded_rectangle([(44, 1245), (736, 1345)], radius=24, fill=(255, 255, 255), outline=(225, 233, 227), width=2)
    # Icon circle
    draw.ellipse([(66, 1267), (122, 1323)], fill=(235, 246, 238))
    draw_vector_leaf(draw, 94, 1295, size=24, color=(62, 123, 84))
    draw.text((140, 1268), "Zyba Companion AI", fill=(27, 36, 30), font=f_card_title)
    draw.text((140, 1304), "Percakapan penuh empati & mindful 24/7", fill=(100, 116, 107), font=f_small)
    # Aktif badge
    draw.rounded_rectangle([(628, 1275), (712, 1315)], radius=16, fill=(230, 245, 235))
    draw.text((648, 1285), "Aktif", fill=(40, 88, 59), font=f_small_bold)

    # Feature 2: Breathing Garden 4-7-8
    draw.rounded_rectangle([(44, 1365), (736, 1465)], radius=24, fill=(255, 255, 255), outline=(225, 233, 227), width=2)
    # Icon circle
    draw.ellipse([(66, 1387), (122, 1443)], fill=(254, 243, 239))
    draw_vector_breeze(draw, 94, 1415, size=24, color=(224, 122, 95))
    draw.text((140, 1388), "Breathing Garden 4-7-8", fill=(27, 36, 30), font=f_card_title)
    draw.text((140, 1424), "Relaksasi ritme napas penurun cemas", fill=(100, 116, 107), font=f_small)
    # Aktif badge
    draw.rounded_rectangle([(628, 1395), (712, 1435)], radius=16, fill=(230, 245, 235))
    draw.text((648, 1405), "Aktif", fill=(40, 88, 59), font=f_small_bold)

    # 7. Floating Bottom Navigation Dock (Y: 1515 to 1625)
    dock_y1, dock_y2 = 1515, 1625
    draw.rounded_rectangle([(48, dock_y1), (732, dock_y2)], radius=42, fill=(255, 255, 255), outline=(215, 228, 220), width=2)

    dock_items = [
        ("Beranda", True),
        ("Check-In", False),
        ("Zibi AI", False),
        ("Ruang Sehat", False),
        ("Pengaturan", False)
    ]
    dock_w = (732 - 48) // len(dock_items)
    for i, (name, is_active) in enumerate(dock_items):
        item_cx = 48 + i * dock_w + dock_w // 2
        if is_active:
            # Active pill indicator
            draw.rounded_rectangle([(item_cx - 36, dock_y1 + 14), (item_cx + 36, dock_y1 + 54)], radius=18, fill=(230, 245, 235))
            draw.ellipse([(item_cx - 10, dock_y1 + 24), (item_cx + 10, dock_y1 + 44)], fill=(62, 123, 84))
            draw.text((item_cx - draw.textlength(name, font=f_tiny)//2, dock_y1 + 68), name, fill=(62, 123, 84), font=f_tiny)
        else:
            draw.ellipse([(item_cx - 8, dock_y1 + 26), (item_cx + 8, dock_y1 + 42)], outline=(140, 155, 145), width=2)
            draw.text((item_cx - draw.textlength(name, font=f_tiny)//2, dock_y1 + 68), name, fill=(140, 155, 145), font=f_tiny)

    # Home indicator bar at very bottom
    draw.rounded_rectangle([(270, 1658), (510, 1666)], radius=4, fill=(180, 195, 185))

    return ui

def find_perspective_coeffs(pa, pb):
    matrix = []
    for (x, y), (u, v) in zip(pb, pa):
        matrix.append([x, y, 1, 0, 0, 0, -u*x, -u*y, u])
        matrix.append([0, 0, 0, x, y, 1, -v*x, -v*y, v])
    n = 8
    for i in range(n):
        pivot = i
        for j in range(i+1, n):
            if abs(matrix[j][i]) > abs(matrix[pivot][i]):
                pivot = j
        matrix[i], matrix[pivot] = matrix[pivot], matrix[i]
        div = matrix[i][i]
        for k in range(i, n+1):
            matrix[i][k] /= div
        for j in range(n):
            if j != i:
                factor = matrix[j][i]
                for k in range(i, n+1):
                    matrix[j][k] -= factor * matrix[i][k]
    return [matrix[i][8] for i in range(n)]

def composite_mockup():
    print("Generating ZYBA Retina Mobile UI...")
    ui = create_zyba_mobile_ui()
    ui.save('public/images/landing/zyba_mobile_retina_ui.png')
    print("Saved public/images/landing/zyba_mobile_retina_ui.png")

    template = Image.open('public/images/landing/phone_template_raw.png').convert('RGBA')
    mask = Image.open('public/images/landing/screen_mask.png').convert('L')

    w, h = ui.size
    src_pts = [(0, 0), (w, 0), (w, h), (0, h)]
    dst_pts = [
        (335.6, 51.0),
        (565.7, 119.2),
        (319.1, 792.1),
        (111.0, 670.9),
    ]

    print("Warping UI to 3D perspective screen quadrilateral...")
    coeffs = find_perspective_coeffs(src_pts, dst_pts)
    warped_ui = ui.transform(template.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)

    print("Compositing warped UI onto phone frame...")
    composite = Image.composite(warped_ui, template, mask)

    # Subtle ambient glass reflection gloss across the screen for photorealism
    gloss = Image.new('RGBA', template.size, (0, 0, 0, 0))
    gloss_draw = ImageDraw.Draw(gloss)
    gloss_draw.polygon([
        (320, 50),
        (570, 120),
        (530, 260),
        (260, 180)
    ], fill=(255, 255, 255, 18))
    gloss_draw.polygon([
        (250, 190),
        (520, 270),
        (480, 380),
        (200, 290)
    ], fill=(255, 255, 255, 8))
    
    # Apply gloss only where screen mask is
    composite = Image.composite(Image.alpha_composite(composite, gloss), composite, mask)

    out_path = 'public/images/landing/hero_phone_3d_mockup.png'
    composite.save(out_path, optimize=True)
    print(f"Successfully generated 3D Phone Mockup at {out_path}!")

if __name__ == '__main__':
    composite_mockup()
