"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  CreditCard,
  LogOut,
} from "lucide-react";

const articles = [
  {
    id: 1,
    name: "Crème Brûlée",
    purchasePrice: "€20.59",
    priceExclTax: "€25.59",
    priceTTC: "€30.71",
    category: "Dessert",
  },
  {
    id: 2,
    name: "Tarte Tatin",
    purchasePrice: "€53.63",
    priceExclTax: "€58.63",
    priceTTC: "€70.36",
    category: "Dessert",
  },
  {
    id: 3,
    name: "Macarons",
    purchasePrice: "€14.57",
    priceExclTax: "€19.57",
    priceTTC: "€23.48",
    category: "Dessert",
  },
  {
    id: 4,
    name: "Éclair au Chocolat",
    purchasePrice: "€10.79",
    priceExclTax: "€15.79",
    priceTTC: "€18.95",
    category: "Dessert",
  },
  {
    id: 5,
    name: "Mousse au Chocolat",
    purchasePrice: "€20.24",
    priceExclTax: "€25.24",
    priceTTC: "€30.29",
    category: "Dessert",
  },
  {
    id: 6,
    name: "Profiteroles",
    purchasePrice: "€15.32",
    priceExclTax: "€20.32",
    priceTTC: "€24.38",
    category: "Dessert",
  },
  {
    id: 7,
    name: "Mille-feuille",
    purchasePrice: "€13.89",
    priceExclTax: "€18.89",
    priceTTC: "€22.67",
    category: "Dessert",
  },
  {
    id: 8,
    name: "Tarte au Citron",
    purchasePrice: "€54.93",
    priceExclTax: "€59.93",
    priceTTC: "€71.92",
    category: "Dessert",
  },
  {
    id: 9,
    name: "Soufflé au Grand Marnier",
    purchasePrice: "€32.85",
    priceExclTax: "€37.85",
    priceTTC: "€45.42",
    category: "Dessert",
  },
  {
    id: 10,
    name: "Clafoutis aux Cerises",
    purchasePrice: "€78.13",
    priceExclTax: "€83.13",
    priceTTC: "€99.76",
    category: "Dessert",
  },
];

const sidebarItems = [
  { name: "Info de l'entreprise", active: false },
  { name: "Numération", active: false },
  { name: "Clients", active: false },
  { name: "Utilisateurs", active: false },
  { name: "Catégories", active: false },
  { name: "Articles", active: true },
  { name: "Salles", active: false },
];

export default function Component() {
  const [searchName, setSearchName] = useState("");
  const [searchLabel, setSearchLabel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Paramètres</h1>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Paramètres des articles
            </h2>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-md transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un article
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par label..."
                value={searchLabel}
                onChange={(e) => setSearchLabel(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <button
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200 flex items-center justify-between"
              >
                <span className="text-gray-900">
                  {selectedCategory === "all"
                    ? "Toutes les catégories"
                    : selectedCategory}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isSelectOpen ? "rotate-90" : ""
                  }`}
                />
              </button>
              {isSelectOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setIsSelectOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg"
                  >
                    Toutes les catégories
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("dessert");
                      setIsSelectOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    Dessert
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("entree");
                      setIsSelectOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    Entrée
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory("plat");
                      setIsSelectOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 last:rounded-b-lg"
                  >
                    Plat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Prix d'achat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Prix hors taxes
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Prix TTC
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Labels
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article, index) => (
                    <tr
                      key={article.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            240 x 240
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {article.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {article.purchasePrice}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {article.priceExclTax}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {article.priceTTC}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">-</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 hover:border-red-400 transition-colors duration-200">
                            <Trash2 className="w-4 h-4 mr-1" />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </button>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      page === 1
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-end space-x-3">
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <BarChart3 className="w-4 h-4 mr-2" />
              POS
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <CreditCard className="w-4 h-4 mr-2" />
              Rapports
            </button>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors duration-200">
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
