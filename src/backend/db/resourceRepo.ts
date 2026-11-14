export interface ResourceArticle {
  id: string;
  type: "ARTICLE" | "AUDIO";
  title: string;
  subtitle?: string;
  category: "stres" | "tidur" | "sosial" | "mindful";
  categoryLabel: string;
  author: string;
  authorRole?: string;
  readTimeMin: number;
  publishedAt?: string;
  imageUrl?: string;
  snippet: string;
  body: string;
  pullQuote?: {
    quote: string;
    author: string;
    role: string;
  };
  tags?: string[];
  audioFreq?: number; // for calm sound generator
}

export const SEED_RESOURCES: ResourceArticle[] = [
  {
    id: "res-1",
    type: "ARTICLE",
    category: "stres",
    categoryLabel: "Manajemen Stres",
    title: "Mengurai Beban 'Harus Sukses Sebelum 25': Menata Ulang Ekspektasi Sosial",
    subtitle: "Menemukan kembali ritme hidup sendiri di tengah banjir pencapaian linimasa yang tak kunjung henti.",
    author: "Tim Psikologi ZYBA",
    authorRole: "Kurator Psikologi Klinis & Wellness",
    readTimeMin: 4,
    publishedAt: "14 November 2026",
    imageUrl: "/images/resources/res-1-lifestyle.svg",
    tags: ["Manajemen Stres", "Refleksi Jiwa", "Ekspektasi Sosial", "Anti-Burnout"],
    snippet: "Tekanan membandingkan garis waktu diri dengan sorotan media sosial sering kali menjadi pemicu utama kelelahan mental generasi muda.",
    pullQuote: {
      quote: "Memberi diri sendiri izin untuk melambat bukanlah bentuk kekalahan, melainkan kebijaksanaan batin untuk mengenali kapasitas diri.",
      author: "Tim Psikologi ZYBA",
      role: "Kurasi Mindful ZYBA",
    },
    body: `Membuka media sosial di penghujung hari kerap kali berubah menjadi ajang penghakiman diri tanpa sadar. Melihat teman sebaya mengumumkan pencapaian karir baru, kelulusan lebih cepat, atau portofolio investasi sering kali memicu bisikan di kepala: "Apakah aku sudah tertinggal?"

Kenyataannya, garis waktu setiap orang tidak pernah dimulai dari titik awal yang sama. Kelelahan yang kamu rasakan bukanlah tanda kemalasan, melainkan alarm bahwa tubuh dan batinmu sedang memikul beban ekspektasi yang melampaui kapasitas sehat.

Berikut tiga langkah sadar untuk mengurai tekanan ini:
1. Kenali Jebakan 'Perbandingan Tak Seimbang': Ingatlah bahwa linimasa media sosial hanyalah etalase pencapaian, bukan ruang dokumentasi kegagalan atau air mata di balik layar.
2. Definisikan Ulang Makna Suksesmu: Sukses tidak melulu tentang nominal gaji atau jabatan prestisius. Mampu bangun pagi dengan napas lega, menjaga hubungan yang hangat dengan orang terdekat, dan tidur nyenyak juga merupakan bentuk kesuksesan yang sangat mahal.
3. Beri Dirimu Izin Berproses: Tidak ada batas waktu mutlak di usia 25 tahun. Hidup bukan perlombaan lari cepat, melainkan perjalanan mendaki yang membutuhkan jeda untuk minum dan memulihkan napas.`,
  },
  {
    id: "res-2",
    type: "ARTICLE",
    category: "sosial",
    categoryLabel: "Baterai Sosial",
    title: "Baterai Sosial Menipis? Cara Memulihkan Diri Tanpa Rasa Bersalah (FOMO)",
    subtitle: "Seni menetapkan batasan batin yang sehat tanpa takut kehilangan koneksi pertemanan.",
    author: "Tim Psikologi ZYBA",
    authorRole: "Spesialis Dinamika Interpersonal",
    readTimeMin: 3,
    publishedAt: "12 November 2026",
    imageUrl: "/images/resources/res-2-social.svg",
    tags: ["Baterai Sosial", "Batasan Diri", "FOMO", "Kesehatan Jiwa"],
    snippet: "Menolak ajakan berkumpul saat tubuh dan batinmu lelah bukanlah bentuk egois, melainkan batasan sehat untuk menjaga kesehatan mental.",
    pullQuote: {
      quote: "Kamu tidak bisa menuangkan air dari teko yang kosong. Merawat diri sendiri adalah prasyarat utama untuk bisa hadir utuh bagi orang lain.",
      author: "Nadia Larasati",
      role: "Peneliti Perilaku & Hubungan",
    },
    body: `Pernahkah kamu merasa sangat terkuras tenaganya hanya setelah beberapa jam berada di keramaian atau membalas rentetan pesan grup? Itu adalah tanda nyata bahwa 'baterai sosialmu' berada di ambang batas minimum.

Di era di mana kita dituntut untuk selalu terkoneksi 24/7, memilih untuk offline dan menyendiri sering kali memicu rasa bersalah—takut dicap tidak asik atau takut ketinggalan momen seru (FOMO).

Cara memulihkan diri dengan tenang:
1. Komunikasikan dengan Jujur & Singkat: Kamu tidak perlu membuat alasan rumit. Kalimat sederhana seperti, "Terima kasih banyak sudah diajak, tapi malam ini aku butuh istirahat di rumah dulu ya," sudah sangat cukup dan terhormat.
2. Ciptakan Ruang 'Dekompresi': Sediakan setidaknya 30 menit tanpa gawai saat tiba di rumah. Mandi air hangat, menyeduh teh chamomile, atau sekadar berbaring diam tanpa suara.
3. Ingat bahwa Menjaga Diri Sendiri Adalah Prasyarat Hadir Bagi Orang Lain: Kamu tidak bisa menuangkan air dari teko yang kosong. Kamu baru bisa menjadi teman yang suportif jika dirimu sendiri dalam keadaan utuh.`,
  },
  {
    id: "res-3",
    type: "ARTICLE",
    category: "tidur",
    categoryLabel: "Kualitas Tidur",
    title: "Ritual Malam Bebas Layar: 4 Langkah Konkret untuk Mengatasi Insomnia",
    subtitle: "Menjinakkan pikiran yang berisik menjelang tidur dan memulihkan ritme biologis alami.",
    author: "Tim Medis & Perilaku ZYBA",
    authorRole: "Pakar Higiene Tidur & Ritme Sirkadian",
    readTimeMin: 4,
    publishedAt: "10 November 2026",
    imageUrl: "/images/resources/res-3-night.svg",
    tags: ["Kualitas Tidur", "Insomnia", "Ritual Malam", "Detoks Digital"],
    snippet: "Kualitas tidur malam menentukan bagaimana kestabilan emosi dan ketahanan fisikmu dalam menghadapi hari esok.",
    pullQuote: {
      quote: "Otak tidak punya saklar mati seketika. Tidur nyenyak adalah undangan yang disiapkan perlahan melalui ruang transisi yang tenang.",
      author: "dr. Aris Thorne",
      role: "Konsultan Tidur & Neurologi",
    },
    body: `Banyak dari kita mengeluhkan pikiran yang mendadak 'berisik' begitu lampu kamar dimatikan. Pertanyaan tentang masa depan, percakapan canggung tiga tahun lalu, atau daftar tugas esok hari seolah berebut perhatian tepat saat kepala menyentuh bantal.

Otak kita tidak memiliki saklar instan untuk langsung beralih dari mode kerja sibuk ke mode tidur lelap. Otak membutuhkan ritual transisi yang memberi sinyal aman.

Empat langkah ritual malam santai:
1. Terapkan 'Curfew Digital' 45 Menit Sebelum Tidur: Paparan cahaya biru dari layar ponsel menekan produksi melatonin alami. Letakkan ponsel di meja yang jauh dari jangkauan kasur.
2. Teknik 'Brain Dump' (Mengosongkan Pikiran): Tuliskan semua kekhawatiran dan daftar tugas esok hari di secarik kertas. Dengan menuliskannya, otak merasa tenang karena tahu hal-hal tersebut tidak akan terlupakan.
3. Atur Suhu dan Pencahayaan Redup: Suhu ruangan yang sejuk dan cahaya lampu temaram kuning hangat membantu memicu kantuk secara alami.
4. Latihan Napas Berirama: Gunakan teknik pernapasan 4-7-8 selama 3 siklus untuk meredakan ketegangan otot leher dan dada.`,
  },
  {
    id: "res-4",
    type: "ARTICLE",
    category: "mindful",
    categoryLabel: "Kecemasan & Mindfulness",
    title: "Menenangkan Pikiran yang Berisik: Teknik 'Grounding 5-4-3-2-1' Saat Cemas Datang",
    subtitle: "Jangkar sensori tubuh untuk menarik kembali kesadaran saat serangan panik dan overthinking menyergap.",
    author: "Tim Psikologi ZYBA",
    authorRole: "Fasilitator Terapi Berbasis Kesadaran",
    readTimeMin: 3,
    publishedAt: "08 November 2026",
    imageUrl: "/images/resources/res-4-grounding.svg",
    tags: ["Mindfulness", "Grounding", "Kecemasan", "Regulasi Emosi"],
    snippet: "Saat serangan cemas atau overthinking datang menyergap, teknik grounding sensori membantu mengembalikan kesadaranmu ke saat ini.",
    pullQuote: {
      quote: "Kecemasan hidup di masa depan yang belum tentu ada. Indra tubuh kita hanya bisa hidup di sini dan sekarang.",
      author: "Maya Kirana, M.Psi",
      role: "Praktisi Mindfulness",
    },
    body: `Kecemasan kerap membawa pikiran kita melompat jauh ke skenario terburuk di masa depan yang belum tentu terjadi. Saat tubuh mulai merespons dengan jantung berdegup kencang, napas pendek, atau tangan dingin, teknik sensori 5-4-3-2-1 adalah jangkar yang paling cepat dan efektif.

Praktekkan teknik ini di mana pun kamu berada:
- 5 Hal yang Kamu LIHAT: Tengok sekelilingmu, sebutkan dalam hati 5 benda nyata (misal: warna dinding, pola kayu meja, jam dinding, sepatu, bayangan daun).
- 4 Hal yang Kamu SENTUH: Rasakan tekstur fisik yang bersentuhan dengan tubuhmu (misal: dinginnya permukaan meja, kain bajumu, telapak kaki yang menjejak lantai, rambut di kening).
- 3 Hal yang Kamu DENGAR: Perhatikan suara di latar belakang (misal: desau kipas angin, deru kendaraan jauh, suara napasmu sendiri).
- 2 Hal yang Kamu CIUM: Hirup udara sekitar dan rasakan aromanya (misal: aroma kopi, wangi sabun, atau udara segar).
- 1 Hal yang Kamu KECAP: Sadari rasa di lidahmu atau teguk sedikit air dingin.

Teknik ini memaksa sistem saraf parasimpatik untuk mengambil alih kendali, mengingatkan otakmu bahwa pada detik ini, di ruangan ini, kamu dalam keadaan aman.`,
  },
  {
    id: "res-5",
    type: "ARTICLE",
    category: "stres",
    categoryLabel: "Akademik & Karir",
    title: "Menyikapi Kebuntuan Skripsi & Ujian: Mengubah Titik Nadir Menjadi Titik Pulih",
    subtitle: "Membedah sindrom impostor dan menata ulang strategi belajar mikro tanpa menyiksa diri.",
    author: "Tim Edukasi ZYBA",
    authorRole: "Konselor Akademik Mahasiswa",
    readTimeMin: 4,
    publishedAt: "06 November 2026",
    imageUrl: "/images/resources/res-5-focus.svg",
    tags: ["Akademik", "Kebuntuan", "Produktivitas Lembut", "Skripsi"],
    snippet: "Impostor syndrome dan rasa buntu sering kali bukan bukti bahwa kamu tidak mampu, melainkan sinyal bahwa kamu kelelahan.",
    pullQuote: {
      quote: "Kebuntuan kreatif bukanlah bukti ketidakmampuan, melainkan tanda bahwa kapasitas kognitifmu sedang membutuhkan jeda untuk menyusun ulang pola.",
      author: "Dimas Anggara",
      role: "Mentor Edukasi ZYBA",
    },
    body: `Melihat kursor berkedip-kedip di dokumen skripsi yang kosong selama berjam-jam bisa membuat seseorang merasa sangat tidak berdaya. Muncul rasa bersalah kepada orang tua, rasa malu pada teman sebaya, hingga keraguan pada kemampuan intelektual diri sendiri.

Kebuntuan kreatif dan kognitif hampir selalu berakar dari kelelahan mental, bukan ketiadaan kompetensi.

Strategi menghadapi kebuntuan:
1. Turunkan Target Menjadi 'Micro-Goal': Jangan menargetkan menulis satu bab sekaligus. Targetkan menulis 2 paragraf saja, atau bahkan sekadar merapikan daftar pustaka selama 15 menit. Aksi kecil mencairkan inersia.
2. Pisahkan Diri dari Karyamu: Kualitas draf tulisan yang belum sempurna tidak mencerminkan nilai dirimu sebagai seorang manusia utuh.
3. Cari Teman Saling Jaga: Berbagilah cerita di lingkar komunitas ZYBA atau teman terpercaya. Mengetahui bahwa kamu tidak sendirian menghadapi pergumulan ini akan meringankan beban batin secara signifikan.`,
  },
  {
    id: "res-6",
    type: "ARTICLE",
    category: "mindful",
    categoryLabel: "Welas Asih Diri",
    title: "Self-Compassion: Mengapa Kita Lebih Keras pada Diri Sendiri Ketimbang Teman?",
    subtitle: "Mengubah bisikan batin yang mencela menjadi suara sahabat yang penuh empati dan penerimaan.",
    author: "Tim Psikologi ZYBA",
    authorRole: "Fasilitator Self-Compassion",
    readTimeMin: 3,
    publishedAt: "04 November 2026",
    imageUrl: "/images/resources/res-6-compassion.svg",
    tags: ["Welas Asih", "Batin Damai", "Penerimaan Diri", "Refleksi"],
    snippet: "Belajar memperlakukan diri sendiri dengan kehangatan yang sama seperti saat kita mendengarkan sahabat yang sedang terluka.",
    pullQuote: {
      quote: "Menjadi baik pada diri sendiri bukanlah kelemahan. Itu adalah satu-satunya cara kita bisa bertahan hidup di dunia yang sering menuntut kesempurnaan.",
      author: "Syauqi Rahman",
      role: "Kurator Suaka Jiwa ZYBA",
    },
    body: `Bayangkan seorang sahabat baikmu datang menangis karena gagal dalam wawancara kerja atau melakukan kesalahan di kantor. Apakah kamu akan berkata, "Kamu memang payah dan tidak pantas sukses"? Tentu tidak. Kamu akan memeluknya, membuatkannya minuman hangat, dan mengingatkannya bahwa ia sudah berjuang sebaik mungkin.

Namun, mengapa saat kita sendiri yang melakukan kesalahan, kalimat pertama yang muncul di kepala kita begitu kejam dan menyakitkan?

Latihan praktis melatih welas asih diri (Self-Compassion):
1. Sadari Kritik Batin (Inner Critic): Sadari saat suaramu di kepala mulai menghakimi. Tarik napas, dan katakan: "Aku menyadari ini adalah momen yang sulit."
2. Hubungkan dengan Kemanusiaan Bersama (Common Humanity): Sadarilah bahwa kegagalan, rasa cemas, dan ketidaksempurnaan adalah bagian tak terpisahkan dari pengalaman menjadi manusia. Tidak ada seorang pun di dunia ini yang hidupnya tanpa cela.
3. Bicaralah Seperti Sahabat Sejati: Ubah kata-kata internalmu. Gantilah "Aku bodoh sekali" menjadi "Aku baru belajar, dan ini adalah proses yang wajar." Beri dirimu pelukan hangat yang layak kamu terima.`,
  },
];

export const RELAXATION_AUDIO_TRACKS = [
  {
    id: "audio-1",
    title: "Hujan Rintik Malam di Suaka",
    desc: "Frekuensi suara gemericik air lembut untuk menurunkan ketegangan gelombang otak.",
    durationMin: 10,
    toneFreq: 210,
  },
  {
    id: "audio-2",
    title: "Aliran Air Sungai & Angin Hutan",
    desc: "Suasana alam rimbun untuk membantu fokus saat belajar atau menulis refleksi.",
    durationMin: 15,
    toneFreq: 174,
  },
  {
    id: "audio-3",
    title: "Desir Ombak Pantai Senja",
    desc: "Ritme deburan ombak berirama teratur untuk memandu tidur yang nyenyak.",
    durationMin: 20,
    toneFreq: 136.1,
  },
];
