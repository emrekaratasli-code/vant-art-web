import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
    EN: {
        collection: "Collection",
        cart: "Cart",
        admin: "Admin",
        heroSubtitle: "Exquisite Jewelry for the Modern Aesthetic.",
        heroCta: "Discover Collection",
        sectionTitle: "The Collection",
        addToCart: "Add to Cart",
        yourBag: "Your Selection",
        emptyBag: "Your bag is empty.",
        subtotal: "Subtotal",
        checkout: "Proceed to Checkout",
        remove: "Remove",
        footerParams: "Luxury Jewelry.",
        // Admin Keys
        adminTitle: "Collection Management",
        addProductTitle: "Add New Piece",
        currentCollection: "Current Collection",
        nameLabel: "Name",
        priceLabel: "Price",
        categoryLabel: "Category",
        imageLabel: "Image URL",
        descLabel: "Description",
        materialLabel: "Material",
        addBtn: "Add to Collection",
        removeBtn: "Remove",
        namePlaceholder: "e.g. Obsidian Ring",
        pricePlaceholder: "100",
        categoryPlaceholder: "Rings",
        imagePlaceholder: "https://...",
        descPlaceholder: "Detailed description...",
        materialPlaceholder: "e.g. Gold, Silver, Diamond",
        checkoutNotImplemented: "Checkout functionality is not available in this demo.",
        addedAlert: "Product Added to Collection",
        // Payment & Legal
        paymentDetails: "Payment Details",
        contactInfo: "Contact Information",
        fullName: "Full Name",
        email: "Email",
        phone: "Phone",
        address: "Address",
        cardHolder: "Card Holder Name",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvc: "CVC",
        paySecurely: "Pay Securely",
        reviewOrder: "Review Order",
        confirmOrder: "Confirm Order",
        backToEdit: "Back to Edit",
        orderSuccess: "Order Placed Successfully!",
        secureBadge: "256-bit SSL Secured",
        footerCopyright: "Luxury Jewelry.",
        phName: "John Doe",
        phEmail: "john@example.com",
        phPhone: "+1 555 000 0000",
        phAddress: "123 Luxury Ave, NY",
        phCardName: "JOHN DOE",
        navContact: "Contact",
        navStory: "Our Story",
        contactTitle: "Contact Us",
        getInTouch: "Get in Touch",
        contactName: "Name",
        contactEmail: "Email",
        contactMessage: "Message",
        sendBtn: "Send Message",
        sentSuccess: "Message Sent!",
        storyTitle: "Our Story",
        storyLead: "Born in the heart of Istanbul, inspired by timeless elegance.",
        storyP1: "VANT ART represents the convergence of traditional craftsmanship and modern aesthetics. Each piece is thoughtfully designed and meticulously handcrafted to be cherished for generations.",
        storyP2: "We believe that jewelry is more than just an accessory; it is an expression of individuality and a celebration of life's most precious moments.",
        legalReturnPolicy: "Return Policy",
        legalPrivacyPolicy: "Privacy Policy",
        legalSalesAgreement: "Distance Sales Agreement",
        city: "City",
        zipCode: "Zip Code",
        paymentError: "An error occurred. Please check your details and try again."
    },
    TR: {
        collection: "Koleksiyon",
        cart: "Sepet",
        admin: "Yönetim",
        heroSubtitle: "Modern Estetik için Enfes Mücevherler.",
        heroCta: "Koleksiyonu Keşfet",
        sectionTitle: "Koleksiyonumuz",
        addToCart: "Sepete Ekle",
        yourBag: "Seçimleriniz",
        emptyBag: "Sepetiniz boş.",
        subtotal: "Ara Toplam",
        checkout: "Ödemeye Geç",
        remove: "Kaldır",
        footerParams: "Lüks Mücevherler.",
        // Admin Keys
        adminTitle: "Koleksiyon Yönetimi",
        addProductTitle: "Yeni Parça Ekle",
        currentCollection: "Mevcut Koleksiyon",
        nameLabel: "Ürün Adı",
        priceLabel: "Fiyat",
        categoryLabel: "Kategori",
        imageLabel: "Görsel URL",
        descLabel: "Açıklama",
        materialLabel: "Malzeme",
        addBtn: "Koleksiyona Ekle",
        removeBtn: "Sil",
        namePlaceholder: "Örn: Obsidyen Yüzük",
        pricePlaceholder: "100",
        categoryPlaceholder: "Yüzükler",
        imagePlaceholder: "https://...",
        descPlaceholder: "Detaylı açıklama...",
        materialPlaceholder: "Örn: Altın, Gümüş, Pırlanta",
        checkoutNotImplemented: "Ödeme işlemi bu demo sürümünde aktif değildir.",
        addedAlert: "Ürün Koleksiyona Eklendi",
        // Payment & Legal
        paymentDetails: "Ödeme Bilgileri",
        contactInfo: "İletişim Bilgileri",
        fullName: "Ad Soyad",
        email: "E-posta",
        phone: "Telefon",
        address: "Adres",
        cardHolder: "Kart Üzerindeki İsim",
        cardNumber: "Kart Numarası",
        expiryDate: "Son Kullanma Tarihi",
        cvc: "CVC",
        paySecurely: "Güvenle Öde",
        reviewOrder: "Siparişi Gözden Geçir",
        confirmOrder: "Siparişi Onayla",
        backToEdit: "Düzenlemeye Dön",
        orderSuccess: "Siparişiniz Başarıyla Alındı!",
        secureBadge: "256-bit SSL Korumalı",
        footerCopyright: "Lüks Mücevherler.",
        phName: "Ahmet Yılmaz",
        phEmail: "ahmet@ornek.com",
        phPhone: "+90 555 000 0000",
        phAddress: "Bağdat Cad. No:1, İstanbul",
        phCardName: "AHMET YILMAZ",
        navContact: "İletişim",
        navStory: "Hikayemiz",
        contactTitle: "Bize Ulaşın",
        getInTouch: "İletişim Bilgileri",
        contactName: "İsim",
        contactEmail: "E-posta",
        contactMessage: "Mesajınız",
        sendBtn: "Mesaj Gönder",
        sentSuccess: "Mesaj Gönderildi!",
        storyTitle: "Hikayemiz",
        storyLead: "İstanbul'un kalbinde doğdu, zamansız zarafetten ilham aldı.",
        storyP1: "VANT ART, geleneksel zanaatkarlığın ve modern estetiğin buluşmasını temsil eder. Her bir parça, nesiller boyu sevilmek üzere özenle tasarlanmış ve elle işlenmiştir.",
        storyP2: "Mücevherin sadece bir aksesuar olmadığına; bireyselliğin bir ifadesi ve hayatın en değerli anlarının bir kutlaması olduğuna inanıyoruz.",
        legalReturnPolicy: "İade Politikası",
        legalPrivacyPolicy: "Gizlilik Politikası",
        legalSalesAgreement: "Mesafeli Satış Sözleşmesi",
        city: "Şehir",
        zipCode: "Posta Kodu",
        paymentError: "Lütfen bilgilerinizi kontrol edip tekrar deneyiniz."
    }
};

const RATES = {
    EN: { code: 'USD', rate: 1, symbol: '$' },
    TR: { code: 'TRY', rate: 34, symbol: '₺' } // Fixed rate for demo
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('TR');

    const toggleLanguage = (lang) => {
        setLanguage(lang);
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    const formatPrice = (amount) => {
        const config = RATES[language];
        const value = amount * config.rate;
        // Format accordingly
        return language === 'TR'
            ? `${config.symbol}${value.toLocaleString('tr-TR')}`
            : `${config.symbol}${value.toLocaleString('en-US')}`;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, formatPrice }}>
            {children}
        </LanguageContext.Provider>
    );
};
