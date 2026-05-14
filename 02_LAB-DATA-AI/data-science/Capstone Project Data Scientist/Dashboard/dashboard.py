import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Konfigurasi halaman
st.set_page_config(
    page_title="Dashboard Nutrisi Makanan/Minuman",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# SIDEBAR
# Load logo
try:
    st.sidebar.image("logo_tim.jpg", width=250)
except:
    st.sidebar.markdown("""
    <div style='text-align: center; padding: 15px; background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); border-radius: 10px;'>
        <h2 style='color: white; margin: 0;'>📊🥗</h2>
        <p style='color: white; margin: 5px 0 0 0; font-weight: bold;'>DASHBOARD NUTRISI</p>
    </div>
    """, unsafe_allow_html=True)
st.sidebar.markdown("---")


# Load data
@st.cache_data
def load_data():
    df = pd.read_csv("data_capstone.csv")
    return df

df = load_data()

# Preprocessing
def kategori_kalori(kalori):
    if kalori < 200:
        return 'Rendah'
    elif kalori <= 400:
        return 'Sedang'
    else:
        return 'Tinggi'

df['Kategori Kalori'] = df['Kalori'].apply(kategori_kalori)
df['Protein Efficiency'] = df['Protein'] / df['Kalori']

# Membuat filter kategori
st.sidebar.header("🔧 Filter")

kategori = st.sidebar.multiselect(
    "Pilih Kategori Kalori",
    options=df['Kategori Kalori'].unique(),
    default=df['Kategori Kalori'].unique()
)

if len(kategori) == 0:
    st.sidebar.warning("⚠️ Silakan pilih setidaknya 1 kategori")

st.sidebar.markdown("---")
st.sidebar.metric("📊 Total Data", len(df))
st.sidebar.metric("✅ Data Terfilter", len(df[df['Kategori Kalori'].isin(kategori)]))

df_filtered = df[df['Kategori Kalori'].isin(kategori)]

# HALAMAN UTAMA
# Membuat judul & KPI
st.title("📊 Dashboard Analisis Nutrisi Makanan & Minuman Indonesia")
st.markdown("Dashboard ini menyajikan analisis nutrisi pada makanan dan minuman di Indonesia")
st.divider()

st.subheader("📈 Key Performance Indicators (KPI)")

col1, col2, col3, col4 = st.columns(4)
col1.metric("📊 Jumlah Data", len(df_filtered))
col2.metric("🔥 Rata-rata Kalori", f"{df_filtered['Kalori'].mean():.1f}")
col3.metric("⚡ Kalori Maksimum", f"{df_filtered['Kalori'].max():.0f}")
col4.metric("🥩 Rata-rata Protein", f"{df_filtered['Protein'].mean():.1f}g")
st.divider()

# VISUALISASI PERTANYAAN
# Pertanyaan 1
st.subheader("📌 Hubungan Makronutrien terhadap Kalori")

korelasi = df_filtered[['Kalori','Karbohidrat','Lemak','Protein']].corr()['Kalori'].drop('Kalori')
korelasi = korelasi.sort_values(ascending=False)

fig1, ax1 = plt.subplots(figsize=(6,4))
sns.barplot(x=korelasi.values, y=korelasi.index, hue=korelasi.index, ax=ax1, palette='viridis', legend=False)
ax1.set_xlim(0,1)
ax1.set_xlabel("Koefisien Korelasi dengan Kalori")
for i, v in enumerate(korelasi.values):
    ax1.text(v + 0.02, i, f"{v:.2f}", va='center')
st.pyplot(fig1)

st.markdown("""
**Insight:**
- **Karbohidrat** memiliki korelasi **sangat kuat** (0.84) terhadap kalori → penyumbang kalori utama
- **Lemak** memiliki korelasi **sedang** (0.40) → cukup berpengaruh
- **Protein** memiliki korelasi **lemah** (0.28) → hampir tidak mempengaruhi kalori
""")
st.divider()

# Pertanyaan 2
st.subheader("📌 Karakteristik Makanan dengan Kalori Tertinggi dan Terendah")

df_filtered['Total Nutrisi'] = df_filtered['Protein'] + df_filtered['Lemak'] + df_filtered['Karbohidrat']

Q1 = df_filtered['Total Nutrisi'].quantile(0.25)
Q3 = df_filtered['Total Nutrisi'].quantile(0.75)

total_nutrisi_rendah = df_filtered[df_filtered['Total Nutrisi'] <= Q1]
total_nutrisi_tinggi = df_filtered[df_filtered['Total Nutrisi'] >= Q3]

tertinggi = total_nutrisi_tinggi.nlargest(5, 'Kalori')[['Nama', 'Kalori', 'Karbohidrat', 'Lemak', 'Protein']]
terendah = total_nutrisi_rendah.nsmallest(5, 'Kalori')[['Nama', 'Kalori', 'Karbohidrat', 'Lemak', 'Protein']]

fig2, axes = plt.subplots(1, 2, figsize=(16, 7))

axes[0].barh(tertinggi['Nama'], tertinggi['Kalori'], color='salmon')
axes[0].set_title(f'5 Makanan dengan Kalori Tertinggi\n(Total Nutrisi ≥ {Q3:.1f} g)', fontweight='bold')
axes[0].set_xlabel('Kalori per 100 gram')
axes[0].invert_yaxis()

axes[1].barh(terendah['Nama'], terendah['Kalori'], color='lightgreen')
axes[1].set_title(f'5 Makanan dengan Kalori Terendah\n(Total Nutrisi ≤ {Q1:.1f} g)', fontweight='bold')
axes[1].set_xlabel('Kalori per 100 gram')
axes[1].invert_yaxis()

plt.tight_layout()
st.pyplot(fig2)

st.markdown("""
**Insight:**
- Makanan berkalori tinggi (446-458 kalori) didominasi oleh makanan yang mengandung karbohidrat
- Makanan berkalori rendah (0-11 kalori) adalah makanan yang alami dan berair (contohnya buah & sayur)      
""")
st.divider()

# Pertanyaan 3
# Cek apakah semua kategori terpilih
if len(kategori) < 3:
    st.warning("⚠️ **Perhatian:** Dashboard ini dioptimalkan dengan 3 kategori kalori (Rendah, Sedang, Tinggi).")
    st.info(f"💡 Saat ini Anda hanya memilih: {', '.join(kategori)}. Silakan pilih ketiga kategori untuk melihat distribusi lengkap.")
    st.info("📊 Untuk melihat pie chart dan analisis distribusi, pilih semua kategori kalori di sidebar.")
else:
    st.subheader("📌 Distribusi Kategori Kalori")
    
    # Pie chart
    jumlah_per_kategori_pie = df_filtered['Kategori Kalori'].value_counts()
    fig_pie, ax_pie = plt.subplots(figsize=(7,7))
    ax_pie.pie(jumlah_per_kategori_pie, 
               labels=jumlah_per_kategori_pie.index,
               autopct='%1.1f%%',
               colors=['#3498db', '#f39c12', '#2ecc71'],
               startangle=90,
               explode=(0.05, 0.05, 0.05))
    ax_pie.set_title('Proporsi Makanan Berdasarkan Kategori Kalori', fontweight='bold', fontsize=12)
    st.pyplot(fig_pie)
    
    # Bar chart jumlah makanan per kategori
    jumlah_per_kategori = df_filtered['Kategori Kalori'].value_counts().reset_index()
    jumlah_per_kategori.columns = ['Kategori Kalori', 'Jumlah Makanan']
    
    fig3, ax3 = plt.subplots(figsize=(9,5))
    bars = ax3.bar(jumlah_per_kategori['Kategori Kalori'], 
                   jumlah_per_kategori['Jumlah Makanan'], 
                   color=['#3498db', '#f39c12', '#2ecc71'])
    
    for bar in bars:
        height = bar.get_height()
        ax3.text(bar.get_x() + bar.get_width()/2., height,
                 f'{int(height)}',
                 ha='center', va='bottom', fontweight='bold')
    
    ax3.set_xlabel('Kategori Kalori')
    ax3.set_ylabel('Jumlah Makanan')
    ax3.set_title('Jumlah Makanan per Kategori Kalori', fontweight='bold')
    ax3.tick_params(axis='x', rotation=0)
    st.pyplot(fig3)
    
    # Bar chart komposisi makronutrien
    komposisi = df_filtered.groupby('Kategori Kalori', observed=True)[['Protein','Lemak','Karbohidrat']].mean()
    fig4, ax4 = plt.subplots(figsize=(11,6))
    komposisi.plot(kind='bar', ax=ax4, width=0.7, 
                   color=['#00b894', '#6c5ce7', '#e84393'])
    
    ax4.set_ylabel('Gram per 100g')
    ax4.set_title('Rata-rata Komposisi Makronutrien per Kategori Kalori', fontweight='bold')
    ax4.legend(title='Makronutrien')
    ax4.grid(axis='y', alpha=0.3)
    
    for container in ax4.containers:
        ax4.bar_label(container, fmt='%.1f', padding=3)
    
    st.pyplot(fig4)
    
    # Insight
    st.markdown("""
    **Insight:**
    - Sebagian besar makanan berada pada kategori kalori rendah, sementara kategori kalori tinggi jumlahnya relatif sedikit
    - Perbedaan kategori kalori terutama dipengaruhi oleh peningkatan kandungan karbohidrat, diikuti oleh lemak, sementara protein relatif stabil
    - Karbohidrat menjadi faktor utama yang membedakan kategori kalori rendah, sedang, dan tinggi  
    """)
    st.divider()

# Pertanyaan 4
st.subheader("📌 Protein Efficiency (Protein per Kalori)")

top10 = df_filtered.nlargest(10, 'Protein Efficiency')
bottom10 = df_filtered[df_filtered['Protein Efficiency'] > 0].nsmallest(10, 'Protein Efficiency')

fig5, ax5 = plt.subplots(1, 2, figsize=(16, 7))
fig5.suptitle('10 Makanan dengan Protein Efficiency Tertinggi dan Terendah', fontsize=20, fontweight='bold')
sns.barplot(x='Protein Efficiency', y='Nama', data=top10, ax=ax5[0], color='teal')
sns.barplot(x='Protein Efficiency', y='Nama', data=bottom10, ax=ax5[1], color='coral')
ax5[0].set_xlabel('Protein Efficiency (g protein per 100 kalori)', fontweight='bold')
ax5[0].set_ylabel('Nama Makanan', fontweight='bold')
ax5[1].set_xlabel('Protein Efficiency (g protein per 100 kalori)', fontweight='bold')
ax5[1].set_ylabel('Nama Makanan', fontweight='bold')

plt.tight_layout()
plt.subplots_adjust(top=0.9)
st.pyplot(fig5)
st.divider()

# TABEL DATA MAKANAN/MINUMAN
st.subheader("📋 Tabel Data Makanan/Minuman")

# Informasi filter
st.info(f"🔍 **Filter aktif:** {', '.join(kategori)} | **Total data di filter:** {len(df_filtered)} makanan")

# Search box untuk pencariqn nama makanan/minuman
cari = st.text_input("🔍 Cari makanan:", placeholder="Contoh: nasi, ayam, ikan...")

if cari:
    df_tabel = df_filtered[df_filtered['Nama'].str.contains(cari, case=False, na=False)]
else:
    df_tabel = df_filtered.copy()

# Menampilkan tabel
st.dataframe(
    df_tabel[['Nama', 'Kategori Kalori', 'Kalori', 'Karbohidrat', 'Protein', 'Lemak', 'Protein Efficiency']].style.format({
        'Kalori': '{:.1f}',
        'Karbohidrat': '{:.1f}',
        'Protein': '{:.1f}',
        'Lemak': '{:.1f}',
        'Protein Efficiency': '{:.3f}'
    }),
    width='stretch',
    height=400
)

# Verifikasi jumlah data
st.caption(f"📌 **Verifikasi:** Menampilkan {len(df_tabel)} dari {len(df_filtered)} data (setelah filter)")

# Menampilkan distribusi kategori di tabel
st.caption(f"📊 **Distribusi kategori di tabel ini:** {dict(df_tabel['Kategori Kalori'].value_counts())}")

# DOWNLOAD DATA
st.subheader("💾 Download Data")

@st.cache_data
def convert_df_to_csv(df_input):
    return df_input.to_csv(index=False).encode('utf-8')

col_download1, col_download2 = st.columns(2)

with col_download1:
    st.download_button("📥 Download Data Hasil Filter", convert_df_to_csv(df_filtered), 
                       "data_hasil_filter.csv", "text/csv", use_container_width='stretch')

with col_download2:
    st.download_button("📥 Download Semua Data", convert_df_to_csv(df), 
                       "data_semua.csv", "text/csv", use_container_width='stretch')

st.divider()

# KESIMPULAN
st.subheader("📝 Kesimpulan Utama")

col1, col2 = st.columns(2)
with col1:
    st.markdown("**✅ Temuan Kunci:**\n- Karbohidrat kontributor terbesar kalori (0.84)\n- Protein pengaruh paling kecil (0.28)")
with col2:
    st.markdown("**💡 Rekomendasi:**\n- Diet rendah kalori → pilih Protein Efficiency tinggi\n- Kontrol kalori → kurangi karbohidrat")
st.divider()

st.markdown("<br>", unsafe_allow_html=True)

# FOOTER
st.markdown(
    "<div style='text-align: center; color: gray;'>"
    "© 2026 📊 Dashboard Analisis Nutrisi Makanan & Minuman Indonesia | Dibuat oleh Tim IMPHNEN"
    "</div>",
    unsafe_allow_html=True
)