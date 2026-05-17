export type Locale = "en" | "am";

export const translations = {
  en: {
    // Navbar
    nav: {
      about: "About",
      howItWorks: "How It Works",
      services: "Services",
      contact: "Contact",
      submitComplaint: "Submit a Complaint",
      report: "Report",
      back: "Back",
    },
    // Hero
    hero: {
      badge: "Woreda 05 · Yeka Subcity Anti-Corruption Committee",
      headline1: "Your Voice",
      headline2: "Matters.",
      headline3: "Report Corruption",
      headline4: "Safely.",
      subtext:
        "We are here to help. Submit your complaint confidentially and our dedicated committee will investigate and take action.",
      cta: "Submit a Complaint",
      ctaSecondary: "How It Works",
      // Side panel
      mission: "We investigate. We act. We protect.",
      committeeLabel: "Woreda 05 Yeka Subcity Anti-Corruption Committee",
      locationLabel: "Addis Ababa, Ethiopia",
      stat1Value: "847+",
      stat1Label: "Cases Resolved",
      stat2Value: "100%",
      stat2Label: "Confidential",
      stat3Value: "Free",
      stat3Label: "No Cost",
      trustLine: "Every complaint receives a formal review.",
    },
    // Features
    features: {
      badge: "Why Report With Us",
      title1: "Built for citizens who",
      title2: "demand accountability",
      subtitle:
        "A secure, transparent platform designed to make corruption reporting simple, safe, and effective.",
      f1title: "Anonymous Reporting",
      f1desc:
        "Submit without revealing your identity. Your privacy is fully protected — name and contact details are optional.",
      f2title: "Secure & Confidential",
      f2desc:
        "Every complaint is handled with strict confidentiality. Only authorized committee members can access submitted information.",
      f3title: "Fast Response",
      f3desc:
        "Our committee reviews every submission promptly and takes action on verified complaints.",
      f4title: "Transparent Process",
      f4desc:
        "We maintain accountability through transparent investigation processes and regular community reporting.",
      centerTitle: "Your Report Matters",
      centerSub: "Every complaint triggers a real investigation",
    },
    // How It Works
    howItWorks: {
      badge: "Simple Process",
      title1: "How the complaint",
      title2: "process works",
      subtitle:
        "Three simple steps from submission to resolution. We make it easy for every citizen to report corruption safely.",
      step1title: "Submit Your Complaint",
      step1desc:
        "Fill out the secure form with details of the incident. Choose to submit anonymously or with your contact information.",
      step2title: "Committee Reviews",
      step2desc:
        "Our dedicated committee carefully reviews your complaint, gathers evidence, and initiates a formal investigation.",
      step3title: "Action Is Taken",
      step3desc:
        "Appropriate action is taken based on investigation findings. Results are documented and accountability is enforced.",
      cta: "Start Your Report Now",
    },
    // Stats
    stats: {
      badge: "Our Impact",
      title1: "Accountability by the",
      title2: "numbers",
      subtitle:
        "Real results from citizens who trusted the platform to report corruption in Woreda 05 Yeka Subcity.",
      s1value: "847+",
      s1name: "Complaints Resolved",
      s1desc: "Cases successfully investigated and closed",
      s2value: "5x",
      s2name: "Faster Reporting",
      s2desc: "Digital submission vs. physical office visits",
      s3value: "100%",
      s3name: "Anonymous Protection",
      s3desc: "Identities fully protected when requested",
    },
    // Partners
    partners: {
      badge: "Institutional Partners",
      title1: "Backed by official",
      title2: "institutions",
      subtitle:
        "Our committee operates in coordination with government and civil society organizations.",
      list: [
        { name: "Federal Ethics & Anti-Corruption Commission", abbr: "FEACC" },
        { name: "Addis Ababa City Administration", abbr: "AACA" },
        { name: "Yeka Subcity Administration", abbr: "YEKA" },
        { name: "Woreda 05 Office", abbr: "W-05" },
        { name: "Civil Society Organizations", abbr: "CSO" },
      ],
    },
    // Testimonials
    testimonials: {
      badge: "Community Voice",
      title1: "Citizens who made their",
      title2: "voices heard",
      subtitle:
        "Real stories from members of our community who used the platform to report corruption.",
      list: [
        {
          name: "Abebe Girma",
          role: "Local Business Owner",
          content:
            "I was afraid to speak up, but this platform gave me the courage to report what I witnessed. The process was simple and my identity was fully protected. Thank you for listening.",
        },
        {
          name: "Tigist Wolde",
          role: "Resident, Woreda 05",
          content:
            "After submitting my complaint about unfair service treatment, the committee followed up within days. I'm amazed that my voice actually made a difference in our community.",
        },
        {
          name: "Dawit Bekele",
          role: "Community Leader",
          content:
            "The anonymous option was essential for me. Knowing my identity would be protected meant I could report without fear of retaliation. This service is vital for our woreda.",
        },
        {
          name: "Meron Haile",
          role: "Teacher",
          content:
            "The form was straightforward and easy to use. I submitted my complaint about a service issue and got confirmation immediately. I felt heard and respected throughout.",
        },
        {
          name: "Henok Tesfaye",
          role: "Youth Representative",
          content:
            "As a young person, I believed my complaint wouldn't matter. This committee proved me wrong. They took my report seriously and investigated the issue thoroughly.",
        },
        {
          name: "Selamawit Alemu",
          role: "Healthcare Worker",
          content:
            "Reporting corruption in healthcare felt impossible before this platform. Now we have a safe, confidential channel. Every citizen in Yeka Subcity should know about this.",
        },
      ],
    },
    // Footer
    footer: {
      readyTitle: "Ready to report?",
      readySubtext:
        "Your complaint could be the change your community needs. Submit safely and confidentially today.",
      cta: "Submit a Complaint",
      brandSub: "The Woreda 05 Yeka Subcity Anti-Corruption Committee is dedicated to building a transparent and accountable community through citizen participation.",
      navLabel: "Navigation",
      legalLabel: "Legal",
      contactLabel: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      accessibility: "Accessibility",
      copyright: "Woreda 05 Yeka Subcity Anti-Corruption Committee. All rights reserved.",
      country: "Federal Democratic Republic of Ethiopia",
    },
    // Submit form
    form: {
      badge: "Confidential Complaint Portal",
      title: "Report a Corruption Issue",
      subtitle:
        "Your identity is protected. The committee will review every submission seriously and take appropriate action.",
      anonymousLabel: "Submit Anonymously",
      anonymousDesc: "Send without personal information — identity fully hidden",
      anonymousActive:
        "Anonymous mode is active. No personal information will be collected or stored with this complaint.",
      sectionPersonal: "Personal Information",
      sectionDetails: "Complaint Details",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. Abebe Girma",
      phone: "Phone Number",
      phonePlaceholder: "e.g. +251-91-xxx-xxxx",
      subject: "Subject",
      subjectPlaceholder: "Brief title of the issue",
      service: "Service",
      servicePlaceholder: "Select the relevant service...",
      description: "Description",
      descriptionPlaceholder:
        "Describe the corruption incident in detail — what happened, when, where, who was involved...",
      descMin: "Minimum 30 characters",
      submitBtn: "Submit Complaint",
      submitting: "Submitting…",
      anonymous: "Anonymous",
      privacy: "All submissions are encrypted and handled with strict confidentiality.",
      // Success
      successTitle: "Complaint Submitted!",
      successText:
        "Your complaint has been received and securely recorded. Our committee will review it promptly.",
      refLabel: "Your Reference ID",
      refSubLabel: "Save this for tracking your complaint",
      anonSuccess:
        "Your identity has been kept fully anonymous. No personal information was recorded.",
      submitAnother: "Submit Another",
      returnHome: "Return Home",
      // Errors
      errFullName: "Full name is required",
      errPhone: "Phone number is required",
      errPhoneInvalid: "Enter a valid phone number",
      errSubject: "Subject is required",
      errService: "Please select a service",
      errDescription: "Description is required",
      errDescShort: "Please provide at least 30 characters of detail",
    },
    // Services list
    services: [
      "Land Administration & Registration",
      "Business License & Permits",
      "Construction & Building Permits",
      "Tax Collection Services",
      "Civil Registry (Birth, Marriage, Death)",
      "Social Welfare Services",
      "Education Administration",
      "Healthcare Facility Services",
      "Water & Sanitation",
      "Police & Security Services",
      "Courts & Legal Services",
      "Public Transportation",
      "Utility Services (Electricity, Telecom)",
      "Other Government Services",
    ],
  },

  am: {
    nav: {
      about: "ስለ እኛ",
      howItWorks: "እንዴት ይሰራል",
      services: "አገልግሎቶች",
      contact: "ያግኙን",
      submitComplaint: "ቅሬታ ያቅርቡ",
      report: "ሪፖርት",
      back: "ተመለስ",
    },
    hero: {
      badge: "ወረዳ 05 የካ ክፍለ ከተማ ፀረ-ሙስና ኮሚቴ",
      headline1: "የእርስዎ ድምጽ",
      headline2: "ወሳኝ ነው።",
      headline3: "የሙስና ወንጀልን",
      headline4: "በሙሉ ሚስጥራዊነት ያሳውቁ።",
      subtext:
        "ለመርዳት እዚህ ነን። ማንነትዎ በተጠበቀ ሁኔታ ቅሬታዎን ያቅርቡ። የእኛ ቁርጠኛ ኮሚቴ ጉዳዩን በጥልቀት በመመርመር ተገቢውን ህጋዊ እርምጃ ይወስዳል።",
      cta: "ቅሬታ ያቅርቡ",
      ctaSecondary: "እንዴት ይሰራል",
      mission: "እንመረምራለን። እርምጃ እንወስዳለን። እንጠብቃለን።",
      committeeLabel: "ወረዳ 05 የካ ክፍለ ከተማ ፀረ-ሙስና ኮሚቴ",
      locationLabel: "አዲስ አበባ፣ ኢትዮጵያ",
      stat1Value: "847+",
      stat1Label: "የተፈቱ ጉዳዮች",
      stat2Value: "100%",
      stat2Label: "ሚስጥራዊ",
      stat3Value: "ነጻ",
      stat3Label: "ምንም ክፍያ የለም",
      trustLine: "እያንዳንዱ ቅሬታ ይታያል።",
    },
    features: {
      badge: "ለምን ከእኛ ጋር ሪፖርት ያድርጉ",
      title1: "ተጠያቂነትን ለሚጠይቁ",
      title2: "ዜጎች ተሠርቷል",
      subtitle:
        "ሙስናን ማሳወቅ ቀላል፣ ደህንነቱ የተጠበቀ እና ውጤታማ እንዲሆን የተነደፈ ደህንነቱ የተጠበቀ እና ግልጽ መድረክ።",
      f1title: "ስም-አልባ ሪፖርት",
      f1desc: "ማንነትዎን ሳይገልጹ ያቅርቡ። ምስጢርዎ ሙሉ በሙሉ ይጠበቃል።",
      f2title: "ደህንነቱ የተጠበቀ እና ሚስጥራዊ",
      f2desc: "እያንዳንዱ ቅሬታ በጥብቅ ሚስጥራዊነት ይያዛል። ፈቃደኛ አባላት ብቻ ይደርሱበታል።",
      f3title: "ፈጣን ምላሽ",
      f3desc: "ኮሚቴያችን እያንዳንዱን ማመልከቻ ወዲያውኑ ይገመግማል።",
      f4title: "ግልጽ ሂደት",
      f4desc: "በምርምር ሂደቶች ተጠያቂነትን እናስቀምጣለን።",
      centerTitle: "ሪፖርትዎ ጠቃሚ ነው",
      centerSub: "እያንዳንዱ ቅሬታ ኦፊሴላዊ ምርምር ያስጀምራል",
    },
    howItWorks: {
      badge: "ቀላል ሂደት",
      title1: "የቅሬታ ሂደት",
      title2: "እንዴት ይሰራል",
      subtitle:
        "ከማቅረቡ እስከ መፍትሄው ሦስት ቀላል ደረጃዎች። ሙስናን ለማሳወቅ ለሁሉም ዜጋ ቀላል እናደርጋለን።",
      step1title: "ቅሬታዎን ያቅርቡ",
      step1desc:
        "ስለ ጉዳዩ ዝርዝር ያቅርቡ። ስምዎን ሳይጠቀሙ ወይም ከስምዎ ጋር ማቅረብ ይችላሉ።",
      step2title: "ኮሚቴ ይገምግማል",
      step2desc:
        "ኮሚቴያችን ቅሬታዎን ይፈትሻል፣ ማስረጃ ይሰበስባል እና ኦፊሴላዊ ምርምር ይጀምራል።",
      step3title: "እርምጃ ይወሰዳል",
      step3desc:
        "በምርምር ግኝቶች ላይ ተመስርቶ ተገቢ እርምጃ ይወሰዳል። ውጤቶች ይመዘገባሉ።",
      cta: "ሪፖርትዎን አሁን ይጀምሩ",
    },
    stats: {
      badge: "ተጽዕኖአችን",
      title1: "ተጠያቂነት በ",
      title2: "ቁጥሮች",
      subtitle:
        "ሙስናን ለማሳወቅ መድረኩን ያመኑ ዜጎች ያስገኙ እውነተኛ ውጤቶች።",
      s1value: "847+",
      s1name: "የተፈቱ ቅሬታዎች",
      s1desc: "በስኬት የተመረመሩ እና የተዘጉ ጉዳዮች",
      s2value: "5x",
      s2name: "ፈጣን ሪፖርት",
      s2desc: "ዲጂታል ማቅረቢያ vs. ቢሮ ቅጽ",
      s3value: "100%",
      s3name: "ስም-አልባ ጥበቃ",
      s3desc: "ሲጠየቅ ማንነት ሙሉ በሙሉ ይጠበቃል",
    },
    partners: {
      badge: "ተቋማዊ አጋሮች",
      title1: "ኦፊሴላዊ ተቋማት",
      title2: "ድጋፍ",
      subtitle: "ኮሚቴያችን ከመንግሥት እና ከሲቪል ሶሳይቲ ድርጅቶች ጋር በቅንጅት ይሰራል።",
      list: [
        { name: "የፌዴራል የሥነ ምግባር እና የፀረ-ሙስና ኮሚሽን", abbr: "ፌሥፀሙኮ" },
        { name: "አዲስ አበባ ከተማ አስተዳደር", abbr: "አአከአ" },
        { name: "የካ ክፍለ ከተማ አስተዳደር", abbr: "የካ" },
        { name: "ወረዳ 05 ጽህፈት ቤት", abbr: "ወ-05" },
        { name: "የሲቪል ማህበረሰብ ድርጅቶች", abbr: "ሲማድ" },
      ],
    },
    testimonials: {
      badge: "የማህበረሰብ ድምጽ",
      title1: "ድምጻቸውን ያሰሙ",
      title2: "ዜጎች",
      subtitle:
        "ሙስናን ለማሳወቅ መድረኩን ከተጠቀሙ ማህበረሰባችን አባላት እውነተኛ ታሪኮች።",
      list: [
        {
          name: "አበበ ግርማ",
          role: "የአካባቢው የንግድ ባለቤት",
          content:
            "ለመናገር ፈርቼ ነበር፣ ነገር ግን ይህ መድረክ ያየሁትን ለማሳወቅ ድፍረት ሰጠኝ። አሰራሩ ቀላል እና ማንነቴ ሙሉ በሙሉ የተጠበቀ ነበር። ስለሰማችሁኝ አመሰግናለሁ።",
        },
        {
          name: "ትዕግስት ወልዴ",
          role: "ነዋሪ፣ ወረዳ 05",
          content:
            "ስለ ፍትሃዊ ያልሆነ አገልግሎት አሰጣጥ ቅሬታዬን ካቀረብኩ በኋላ፣ ኮሚቴው በጥቂት ቀናት ውስጥ ክትትል አድርጓል። ድምጼ በማህበረሰባችን ውስጥ ለውጥ ማምጣቱ አስገርሞኛል።",
        },
        {
          name: "ዳዊት በቀለ",
          role: "የማህበረሰብ መሪ",
          content:
            "ስም-አልባ አማራጩ ለእኔ በጣም አስፈላጊ ነበር። ማንነቴ እንደሚጠበቅ ማወቄ ያለ ፍርሃት ሪፖርት እንዳደርግ አስችሎኛል። ይህ አገልግሎት ለወረዳችን ወሳኝ ነው።",
        },
        {
          name: "ሜሮን ሀይሌ",
          role: "መምህርት",
          content:
            "ቅጹ ቀጥተኛ እና ለመጠቀም ቀላል ነበር። ስለ አንድ አገልግሎት ችግር ቅሬታዬን አቀረብኩ እና ወዲያውኑ ማረጋገጫ አገኘሁ። በሂደቱ ሁሉ እንደተሰማሁ እና እንደተከበርኩ ተሰማኝ።",
        },
        {
          name: "ሄኖክ ተስፋዬ",
          role: "የወጣቶች ተወካይ",
          content:
            "እንደ ወጣት፣ ቅሬታዬ ምንም ለውጥ አያመጣም ብዬ አስቤ ነበር። ይህ ኮሚቴ ስህተት መሆኔን አረጋግጦልኛል። ሪፖርቴን በቁም ነገር ወስደው ችግሩን በሚገባ መርምረዋል።",
        },
        {
          name: "ሰላማዊት አለሙ",
          role: "የጤና ባለሙያ",
          content:
            "ከዚህ መድረክ በፊት በጤና እንክብካቤ ውስጥ ሙስናን ማሳወቅ የማይቻል ይመስል ነበር። አሁን ደህንነቱ የተጠበቀ፣ ሚስጥራዊ ቻናል አለን። በየካ ክፍለ ከተማ ያለ እያንዳንዱ ዜጋ ስለዚህ ጉዳይ ማወቅ አለበት።",
        },
      ],
    },
    footer: {
      readyTitle: "ለሪፖርት ዝግጁ ነዎት?",
      readySubtext:
        "ቅሬታዎ ማህበረሰቡ የሚፈልገው ለውጥ ሊሆን ይችላል። ዛሬ በደህና እና በሚስጥር ያቅርቡ።",
      cta: "ቅሬታ ያቅርቡ",
      brandSub: "የወረዳ 05 የካ ክፍለ ከተማ ፀረ-ሙስና ኮሚቴ በዜጎች ተሳትፎ ግልጽ እና ተጠያቂነት ያለው ማህበረሰብ ለመገንባት ቆርጦ ተነስቷል።",
      navLabel: "ዳሰሳ",
      legalLabel: "ህጋዊ",
      contactLabel: "ያግኙን",
      privacy: "የግላዊነት ፖሊሲ",
      terms: "የአጠቃቀም ውሎች",
      accessibility: "ተደራሽነት",
      copyright: "ወረዳ 05 የካ ክፍለ ከተማ ፀረ-ሙስና ኮሚቴ። ሁሉም መብቶች የተጠበቁ ናቸው።",
      country: "የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ",
    },
    form: {
      badge: "ሚስጥራዊ ማቅረቢያ",
      title: "ሙስናን ያሳውቁ",
      subtitle:
        "ማንነትዎ የተጠበቀ ነው። ኮሚቴው እያንዳንዱን ጥቆማ ይመረምራል እርምጃም ይወስዳል።",
      anonymousLabel: "በስውር ያቅርቡ",
      anonymousDesc: "ያለ ግላዊ መረጃ — ማንነት ሙሉ በሙሉ ይደበቃል",
      anonymousActive:
        "ስም-አልባ ሁነታ ነቅቷል። ማንም ግላዊ መረጃዎትን አያይም።",
      sectionPersonal: "ግላዊ መረጃ",
      sectionDetails: "የቅሬታ ዝርዝሮች",
      fullName: "ሙሉ ስም",
      fullNamePlaceholder: "ለምሳሌ፡ አበበ ግርማ",
      phone: "ስልክ ቁጥር",
      phonePlaceholder: "ለምሳሌ፡ +251-91-xxx-xxxx",
      subject: "ርዕሰ ጉዳይ",
      subjectPlaceholder: "የጉዳዩ አጭር ርዕስ",
      service: "አገልግሎት",
      servicePlaceholder: "የሚመለከተውን አገልግሎት ይምረጡ...",
      description: "ዝርዝር መግለጫ",
      descriptionPlaceholder:
        "ዝርዝሩን ያስረዱ — ምን ሆነ፣ መቼ፣ የት፣ ማን ተሳትፏል...",
      descMin: "ቢያንስ 30 ፊደላት",
      submitBtn: "አሁንኑ ያቅርቡ",
      submitting: "እየቀረበ ነው…",
      anonymous: "ስውር",
      privacy: "ሁሉም መረጃዎች በጥብቅ ሚስጥራዊነት ይያዛሉ።",
      successTitle: "ቅሬታ ቀርቧል!",
      successText:
        "ቅሬታዎ ደርሷል እና በደህና ተመዝግቧል። ኮሚቴያችን ወዲያውኑ ይገምግመዋል።",
      refLabel: "የማጣቀሻ ቁጥርዎ",
      refSubLabel: "ቅሬታዎን ለመከታተል ይቆጥቡ",
      anonSuccess:
        "ማንነትዎ ሙሉ በሙሉ ስም-አልባ ሆኖ ተጠብቋል። ምንም ግላዊ መረጃ አልተመዘገበም።",
      submitAnother: "ሌላ ያቅርቡ",
      returnHome: "ወደ መነሻ ይመለሱ",
      errFullName: "ሙሉ ስም ያስፈልጋል",
      errPhone: "ስልክ ቁጥር ያስፈልጋል",
      errPhoneInvalid: "ትክክለኛ ስልክ ቁጥር ያስገቡ",
      errSubject: "ርዕሰ ጉዳይ ያስፈልጋል",
      errService: "አገልግሎት ይምረጡ",
      errDescription: "ዝርዝር መግለጫ ያስፈልጋል",
      errDescShort: "ቢያንስ 30 ፊደላት ይጻፉ",
    },
    services: [
      "የመሬት አስተዳደር እና ምዝገባ",
      "የንግድ ፈቃድ እና ፍቃዶች",
      "የግንባታ ፈቃዶች",
      "የግብር አሰባሰብ አገልግሎቶች",
      "ሲቪል ምዝገባ (ልደት፣ ጋብቻ፣ ሞት)",
      "የማህበራዊ ደህንነት አገልግሎቶች",
      "የትምህርት አስተዳደር",
      "የጤና ተቋም አገልግሎቶች",
      "ውሃ እና ንጽህና",
      "ፖሊስ እና ደህንነት አገልግሎቶች",
      "ፍርድ ቤቶች እና ህጋዊ አገልግሎቶች",
      "የህዝብ ትራንስፖርት",
      "መሠረታዊ አገልግሎቶች (ኤሌክትሪክ፣ ቴሌኮም)",
      "ሌሎች የመንግሥት አገልግሎቶች",
    ],
  },
} as const;

export type TranslationKey = typeof translations.en;
