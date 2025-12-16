import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const PreferencesContext = createContext()

export const usePreferences = () => useContext(PreferencesContext)

const defaultCurrency = 'USD'
const defaultLanguage = 'en'
const defaultTheme = 'dark'

export const PreferencesProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || defaultTheme)
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || defaultCurrency)
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || defaultLanguage)

  const translations = {
    en: {
      home: 'Home',
      dashboard: 'Dashboard',
      agent: 'Agent',
      notes: 'Notes',
      income: 'Income',
      expenses: 'Expenses',
      profile: 'Profile',
      settings: 'Settings',
      financial_overview: 'Financial Overview',
      total_income: 'Total Income',
      total_expenses: 'Total Expenses',
      net_balance: 'Net Balance',
      savings_rate: 'Savings Rate',
      add_income: 'Add Income',
      add_expense: 'Add Expense',
      recent_transactions: 'Recent Transactions',
      expense_categories: 'Expense Categories',
      welcome_back: 'Welcome back!',
      quick_overview: "Here’s a quick overview of your finances today",
      get_started: 'Get Started',
      learn_more: 'Learn More',
    },
    es: {
      home: 'Inicio',
      dashboard: 'Panel',
      agent: 'Asistente',
      notes: 'Notas',
      income: 'Ingresos',
      expenses: 'Gastos',
      profile: 'Perfil',
      settings: 'Configuración',
      financial_overview: 'Resumen financiero',
      total_income: 'Ingresos totales',
      total_expenses: 'Gastos totales',
      net_balance: 'Balance neto',
      savings_rate: 'Tasa de ahorro',
      add_income: 'Agregar ingreso',
      add_expense: 'Agregar gasto',
      recent_transactions: 'Transacciones recientes',
      expense_categories: 'Categorías de gastos',
      welcome_back: '¡Bienvenido de nuevo!',
      quick_overview: 'Un vistazo rápido a tus finanzas',
      get_started: 'Comenzar',
      learn_more: 'Saber más',
    },
    fr: {
      home: 'Accueil',
      dashboard: 'Tableau de bord',
      agent: 'Assistant',
      notes: 'Notes',
      income: 'Revenus',
      expenses: 'Dépenses',
      profile: 'Profil',
      settings: 'Paramètres',
      financial_overview: 'Vue financière',
      total_income: 'Revenus totaux',
      total_expenses: 'Dépenses totales',
      net_balance: 'Solde net',
      savings_rate: 'Taux d’épargne',
      add_income: 'Ajouter un revenu',
      add_expense: 'Ajouter une dépense',
      recent_transactions: 'Transactions récentes',
      expense_categories: 'Catégories de dépenses',
      welcome_back: 'Bon retour !',
      quick_overview: 'Aperçu rapide de vos finances',
      get_started: 'Commencer',
      learn_more: 'En savoir plus',
    },
    de: {
      home: 'Startseite',
      dashboard: 'Dashboard',
      agent: 'Assistent',
      notes: 'Notizen',
      income: 'Einnahmen',
      expenses: 'Ausgaben',
      profile: 'Profil',
      settings: 'Einstellungen',
      financial_overview: 'Finanzübersicht',
      total_income: 'Gesamteinnahmen',
      total_expenses: 'Gesamtausgaben',
      net_balance: 'Nettoguthaben',
      savings_rate: 'Sparquote',
      add_income: 'Einnahme hinzufügen',
      add_expense: 'Ausgabe hinzufügen',
      recent_transactions: 'Letzte Transaktionen',
      expense_categories: 'Ausgabenkategorien',
      welcome_back: 'Willkommen zurück!',
      quick_overview: 'Schneller Überblick über Ihre Finanzen',
      get_started: 'Loslegen',
      learn_more: 'Mehr erfahren',
    },
    it: {
      home: 'Home',
      dashboard: 'Dashboard',
      agent: 'Assistente',
      notes: 'Note',
      income: 'Entrate',
      expenses: 'Spese',
      profile: 'Profilo',
      settings: 'Impostazioni',
      financial_overview: 'Panoramica finanziaria',
      total_income: 'Entrate totali',
      total_expenses: 'Spese totali',
      net_balance: 'Saldo netto',
      savings_rate: 'Tasso di risparmio',
      add_income: 'Aggiungi entrata',
      add_expense: 'Aggiungi spesa',
      recent_transactions: 'Transazioni recenti',
      expense_categories: 'Categorie di spesa',
      welcome_back: 'Bentornato!',
      quick_overview: 'Panoramica rapida delle tue finanze',
      get_started: 'Inizia',
      learn_more: 'Scopri di più',
    },
    pt: {
      home: 'Início',
      dashboard: 'Painel',
      agent: 'Assistente',
      notes: 'Notas',
      income: 'Receitas',
      expenses: 'Despesas',
      profile: 'Perfil',
      settings: 'Configurações',
      financial_overview: 'Visão financeira',
      total_income: 'Receita total',
      total_expenses: 'Despesa total',
      net_balance: 'Saldo líquido',
      savings_rate: 'Taxa de poupança',
      add_income: 'Adicionar receita',
      add_expense: 'Adicionar despesa',
      recent_transactions: 'Transações recentes',
      expense_categories: 'Categorias de despesas',
      welcome_back: 'Bem-vindo de volta!',
      quick_overview: 'Visão rápida das suas finanças',
      get_started: 'Começar',
      learn_more: 'Saiba mais',
    },
  }

  // Apply theme and language to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('language', language)
  }, [language])

  useEffect(() => {
    localStorage.setItem('currency', currency)
  }, [currency])

  const formatCurrency = useMemo(() => {
    return (value) =>
      new Intl.NumberFormat(language, {
        style: 'currency',
        currency: currency || defaultCurrency,
        maximumFractionDigits: 2,
      }).format(value || 0)
  }, [currency, language])

  const t = (key) => {
    const dict = translations[language] || translations[defaultLanguage]
    return dict[key] || translations[defaultLanguage][key] || key
  }

  const value = {
    theme,
    setTheme,
    toggleTheme: () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')),
    currency,
    setCurrency,
    language,
    setLanguage,
    formatCurrency,
    t,
  }

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

