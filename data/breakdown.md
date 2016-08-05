Models (Models they contain):
	GeneList
		Gene(s)
	Term (ONCE SET, NEVER CHANGE)
		Gene(s)
	Vessel (ONCE SET, NEVER CHANGE)
		Anchor(s)
		Gene(s)
	GeneEvent
		GeneList
	DataSource
		Attributes
	SpeciesList (ONCE SET, NEVER CHANGE)
	Sungear/Comp (ONCE SET, NEVER CHANGE)
	GO/CompareCount (ONCE SET, NEVER CHANGE)
	GO/CompareName (ONCE SET, NEVER CHANGE)
	GO/CompareScore (ONCE SET, NEVER CHANGE)


Views:
	AnchorDisplay
	Icons
	SetTool
	VesselDisplay

	PercentIcon
	SearchResults

Controllers (Models they modify):
	VisGene
		(ALL OTHER CONTROLLERS)
	CollapsibleList
		GeneList
	Controls
		GeneList
	ExperimentList
	Sungear
		GeneList
	GOTerm
		Term(s)
	DataReader
		Attributes
	VPConnection & ExternalConnection
		Attributes
	GOBrowser
	TermListCellRenderer
	TermTreeCellRenderer

Unknown:
	GeneListener (I)
	MultiSelectable (I)
	SetTool
	ExportList
	gui/waitcursor/